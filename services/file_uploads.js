// ----------------------------------------
// AWS SDK
// ----------------------------------------
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;
const mime = require('mime');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
const _ = require('lodash');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const PHOTO_DATA_PATH = path.resolve('./services/data/photos.json');

const _writePhotoDataFile = photos => {
  fs.writeFileSync(PHOTO_DATA_PATH, JSON.stringify(photos, null, 2));
};

if (!fs.existsSync(PHOTO_DATA_PATH)) {
  _writePhotoDataFile({});
}

const FileUploader = {};

FileUploader.single = field => upload.single(field);

FileUploader.upload = file => {
  // Use the mime library to get the correct
  // extension for the mimetype
  const extension = mime.getExtension(file.mimetype);

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
        // write the data to a file
        // (instead of using a database)
        console.log('FILE IS HERE', file);
        let todayDate = new Date();
        const photos = require(PHOTO_DATA_PATH);
        const photo = {
          userId: file.userId,
          username: file.username,
          url: data.Location,
          name: data.key,
          description: file.description,
          date: todayDate.toString().substring(0, 15)
        };
        photos[data.key] = photo;
        _writePhotoDataFile(photos);

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
        // Delete the photo from the JSON
        // file-based database
        // if successful and resolve
        // the photo data
        const photos = require(PHOTO_DATA_PATH);
        const photo = _.clone(photos[id]);
        delete photos[id];
        _writePhotoDataFile(photos);
        resolve(photo);
      }
    });
  });
};

module.exports = FileUploader;
