const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true
		},
		password: String,
		photos: [
			{
				key: {
					type: String
				},
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

UserSchema.plugin(uniqueValidator);

UserSchema.methods.getPhoto = key =>
	this.photos.find(photo => photo.key === key);

const User = mongoose.model('User', UserSchema);
module.exports = User;
