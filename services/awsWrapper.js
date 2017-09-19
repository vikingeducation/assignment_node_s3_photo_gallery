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
const upload = async (filename, data) => {
	params.Key = filename;
	params.Body = data;
	try {
		return s3.upload(params);
	} catch (e) {
		console.error(e);
		return e;
	}
};

module.exports = upload;
