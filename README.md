# Github Action for Uploading Files to Qiniu

This is a action for uploading files to [Qiniu](https://qiniu.com).

This action uses the [qiniu nodejs sdk](https://github.com/qiniu/nodejs-sdk) to upload a directory (either from your repository or generated during your workflow) to a cloud bucket.


## Usage
```yaml
name: Upload Website

on:
  push:
    branches:
    - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: hujiulong/qiniu-upload-action@master
      with:
        # Your qiniu access key, required.
        access_key: ${{ secrets.QINIU_ACCESS_KEY }}

        # Your qiniu secret key, required.
        secret_key: ${{ secrets.QINIU_SECRET_KEY }}

        # Bucket name, required.
        bucket: ${{ secrets.QINIU_BUCKET }}

        # The local directory (or file) you want to upload to bucket.
        # Default: './'
        source_dir: 'dist'

        # The directory inside of the bucket you want to upload to, namely key prefix prepended to dest file key.
        # Default: '/'
        dest_dir: '/static'

        # Whether to ignore source maps.
        # Default: true
        ignore_source_map: true
```

## License

[MIT license](LICENSE).
