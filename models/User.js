const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: String,
		passwordHash: String,
		photos: [{
			key: String,
			url: String
		}]
	{
		timestamps: true
	}
);

UserSchema.virtual('password')
	.set(function(password) {
		this.passwordHash = bcrypt.hashSync(password, 12);
	})
	.get(function() {
		return this.passwordHash;
	});

const User = mongoose.model('User', UserSchema);
module.exports = User;
