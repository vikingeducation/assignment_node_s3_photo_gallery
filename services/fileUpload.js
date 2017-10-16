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

const Photo_Data_Path = path.resolve("./data/photos.json");

const writePhotoDataFile = photos => {
  fs.writeFileSync(Photo_Data_Path, JSON.stringify(photos, null, 2));
};

if (!fs.existsSync(Photo_Data_Path)) {
  writePhotoDataFile({});
}

const FileUploader = {};

FileUploader.single = field => upload.single(field);

FileUploader.upload = file => {
  const newFile = {
    name: path.parse(file.name).name,
    extension: mime.getExtension(file.mimetype)
  };

  return new Promise((res, rej) => {
    //s3
    const options = {
      Bucket: bucket,
      Key: `${newFile.name}-${md5(Date.now())}.${newFile.extension}`,
      Body: file.data,
      ACL: "public-read"
    };

    s3.upload(options, (err, data) => {
      if (err) {
        rej(err);
      } else {
        const photos = require(Photo_Data_Path);
        const photo = {
          url: data.Location,
          name: data.key
        };
        photos[data.key] = photo;
        writePhotoDataFile(photos);
        res(photo);
      }
    });
  });
};

FileUploader.remove = id => {
  const options = {
    Bucket: bucket,
    Key: id
  };

  return new Promise((res, rej) => {
    s3.deleteObject(options, (err, data) => {
      if (err) {
        rej(err);
      } else {
        const photos = require(Photo_Data_Path);
        const photo = _.clone(photos[id]);
        delete photos[id];
        writePhotoDataFile(photos);
        res(photo);
      }
    });
  });
};

module.exports = FileUploader;
