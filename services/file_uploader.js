const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const md5 = require('md5');
const mime = require('mime');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const FileUploader = {
  single: field => upload.single(field),

  upload: file => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${ file.originalname.split('.')[0] }-${ md5(Date.now()) }.${ mime.extension(file.mimetype) }`,
        Body: file.buffer
      };

      s3.upload(params, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};

module.exports = FileUploader;
