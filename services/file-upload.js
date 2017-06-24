const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;
const mime = require("mime");
const path = require("path");
const md5 = require("md5");
const fs = require("fs");
const _ = require("lodash");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const FileUploader = {};

FileUploader.single = field => upload.single(field);

FileUploader.upload = file => {
  // Use the mime library to get the correct
  // extension for the mimetype
  const extension = mime.extension(file.mimetype);
  // let extension = mime.extension(file.mimetype);

  // Use the path library to get a consistent
  // file name
  const filename = path.parse(file.name).name;

  return new Promise((resolve, reject) => {
    // Configure the S3 request options
    const options = {
      Bucket: bucket,

      // Use the md5 library to create a unique
      // hash for this file name and attach
      // the extension
      Key: `${filename}-${md5(Date.now())}.${extension}`,
      Body: file.data
    };

    // Upload the file
    s3.upload(options, (err, data) => {
      // If there's an error
      // reject the promise
      if (err) {
        reject(err);
      } else {
        // Else we're going to
        // return the data to use to save to db in a separate service
        const photo = {
          url: data.Location,
          name: data.key
        };

        // Resolve the photo data
        resolve(photo);
      }
    });
  });
};

FileUploader.remove = id => {
  // Configure the request
  const options = {
    Bucket: bucket,
    Key: id
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(options, (err, data) => {
      // Reject if error
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = FileUploader;
