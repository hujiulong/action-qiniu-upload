import * as core from '@actions/core';
import { genToken } from './token';
import { upload } from './upload';

async function run(): Promise<void> {
  try {
    const ak = core.getInput('access_key');
    const sk = core.getInput('secret_key');
    const bucket = core.getInput('bucket');
    const sourceDir = core.getInput('source_dir');
    const destDir = core.getInput('dest_dir');
    const ignoreSourceMap = core.getInput('ignore_source_map');

    const token = genToken(bucket, ak, sk);

    upload(
      token,
      sourceDir,
      destDir,
      Boolean(ignoreSourceMap),
      (file, key) => core.info(`success: ${file} => ${key}`),
      () => core.info('Done!'),
      (error) => core.setFailed(error.message),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
