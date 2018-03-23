const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bucket = process.env.AWS_S3_BUCKET;
const mime = require("mime");
const path = require("path");
const md5 = require("md5");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const mongoose = require("mongoose");
const models = require("./../models");
const Photo = mongoose.model("Photo");

const FileUploader = {};

FileUploader.single = field => upload.single(field);

FileUploader.upload = file => {
	// Use the mime library to get the correct
	// extension for the mimetype
	const extension = mime.extension(file.mimetype);

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
				// write the data to a database

				const photo = new Photo({
					url: data.Location,
					key: data.Key,
					photoName: file.photoName,
					description: file.desc,
					userId: file.userId
				});

				photo.save((err, photo) => {
					if (err) {
						reject(err);
					} else {
						resolve(photo);
					}
				});
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
				// Delete the photo from the database
				Photo.remove({ key: id })
					.then(() => {
						resolve();
					})
					.catch(() => reject(err));
			}
		});
	});
};

module.exports = FileUploader;
