const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

// Create local strategy
module.exports = new LocalStrategy(
	{
		usernameField: "email"
	},
	(email, password, done) => {
		User.findOne({ email: email })
			.then(user => {
				const isValid = user.validatePassword(password);
				return done(null, isValid ? user : false);
			})
			.catch(e => done(null, false));
	}
);