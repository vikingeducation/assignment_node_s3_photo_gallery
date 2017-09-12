const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));
const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;
const mime = require("mime");
const path = require("path");
const md5 = require("md5");
const { Photo, User } = require("../models");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const FileUploader = {};

FileUploader.single = field => {
  return upload.single(field);
};

FileUploader.upload = async (file, user) => {
  const extension = mime.extension(file.mimetype);
  const filename = path.parse(file.name).name;
  const options = {
    Bucket: bucket,
    Key: `${filename}-${md5(Date.now())}.${extension}`,
    Body: file.data
  };

  // Upload the file
  const data = await s3.upload(options).promise();
  const photo = await Photo.create({
    url: data.Location,
    name: data.key,
    user
  });

  return User.update({ _id: user._id }, { $push: { photos: photo } });
};

FileUploader.remove = async name => {
  const options = {
    Bucket: bucket,
    Key: name
  };

  await s3.deleteObject(options).promise();
  await Photo.remove({ name });
};

module.exports = FileUploader;
