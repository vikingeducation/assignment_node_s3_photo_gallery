const mongoose = require('mongoose');
// const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
	{
		username: String,
		password: String,
		photos: [
			{
				key: String,
				filename: String,
				description: String,
				url: String
			}
		]
	},
	{
		timestamps: true
	}
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
