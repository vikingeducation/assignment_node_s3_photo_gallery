const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bluebird = require('bluebird');
s3.upload = bluebird.promisify(s3.upload);

const fs = require('fs');

const params = {
	Bucket: process.env.AWS_S3_BUCKET,
	Key: 'aws-logo.svg',
	Body: null
};

// params.Body = fs.readFileSync("./aws-logo.svg");
const s3Upload = (filename, data) => {
	params.Key = filename;
	params.Body = data;

	return s3.upload(params);
};

const s3Delete = key => {
	var params = {
		Bucket: process.env.AWS_S3_BUCKET /* required */,
		Key: key /* required */
	};
	return s3.deleteObject(params);
};

module.exports = {
	s3Upload,
	s3Delete
};
