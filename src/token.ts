import qiniu from 'qiniu';

export function genToken(bucket: string, ak: string, sk: string): string {
  const mac = new qiniu.auth.digest.Mac(ak, sk);

  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
  });
  const token = putPolicy.uploadToken(mac);
  return token;
}
