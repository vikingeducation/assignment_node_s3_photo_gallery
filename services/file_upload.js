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
  // Use the mime library to get the correct
  // extension for the mimetype
  const extension = mime.extension(file.mimetype);

  // Use the path library to get a consistent
  // file name
  const filename = path.parse(file.name).name;

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
  const data = await s3.upload(options).promise();
  const photo = await Photo.create({
    url: data.Location,
    name: data.key,
    user
  });

  return User.update({ _id: user._id }, { $push: { photos: photo } });
};

FileUploader.remove = async name => {
  // Configure the request
  const options = {
    Bucket: bucket,
    Key: name
  };

  console.log("Options: ", options);
  const data = await s3.deleteObject(options).promise();
  console.log("Data: ", data);
  const photo = await Photo.remove({ name });
};

module.exports = FileUploader;
