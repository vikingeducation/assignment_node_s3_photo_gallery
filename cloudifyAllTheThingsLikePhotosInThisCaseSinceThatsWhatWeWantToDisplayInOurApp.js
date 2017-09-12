const AWS = require("aws-sdk");
const mime = require("mime");
const path = require("path");
const md5 = require("md5");
const fs = require("fs");
const _ = require("lodash");

// s3 stuff
const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;

// multer stuff
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// multer middleware
const mw = upload.single("photo[file]");

// do stuff

const FileUploader = {
  // add functions
};

module.exports = FileUploader;
