import qiniu from 'qiniu';
import path from 'path';
import glob from 'glob';
import pAll from 'p-all';
import pRetry from 'p-retry';

export function upload(
  token: string,
  srcDir: string,
  destDir: string,
  ignoreSourceMap: boolean,
  onProgress: (srcFile: string, destFile: string) => void,
  onComplete: () => void,
  onFail: (errorInfo: any) => void,
): void {
  const baseDir = path.resolve(process.cwd(), srcDir);
  const files = glob.sync(`${baseDir}/**/*`, { nodir: true });

  const config = new qiniu.conf.Config();
  const uploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  const tasks = files.map((file) => {
    const relativePath = path.relative(baseDir, path.dirname(file));
    const key = path.join(destDir, relativePath, path.basename(file));

    if (ignoreSourceMap && file.endsWith('.map')) return null;

    const task = (): Promise<any> => new Promise((resolve, reject) => {
      uploader.putFile(token, key, file, putExtra, (err, body, info) => {
        if (err) return reject(new Error(`Upload failed: ${file}`));

        if (info.statusCode === 200) {
          onProgress(file, key);
          return resolve({ file, to: key });
        }

        reject(new Error(`Upload failed: ${file}`));
      });
    });

    return () => pRetry(task, { retries: 3 });
  }).filter((item) => !!item) as (() => Promise<any>)[];

  pAll(tasks, { concurrency: 5 })
    .then(onComplete)
    .catch(onFail);
}
