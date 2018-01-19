const AWS = require('aws-sdk');
const mime = require('mime');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
const multer = require('multer');

const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const FileUploader = {};

FileUploader.single = field => upload.single(field);

FileUploader.upload = file => {
  const extension = mime.getExtension(file.mimetype);
  const filename = path.parse(file.name).name;

  return new Promise((resolve, reject) => {
    const options = {
      Bucket: bucket,
      Key: `${filename}-${md5(Date.now())}.${extension}`,
      Body: file.data
    };

    s3.upload(options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const photo = {
          name: data.key,
          url: data.Location
        };

        resolve(photo);
      }
    });
  });
};

FileUploader.remove = id => {
  const options = {
    Bucket: bucket,
    Key: id
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = FileUploader;
