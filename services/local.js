const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./../models");

// Create local strategy
module.exports = new LocalStrategy(
	{
		usernameField: "username"
	},
	(username, password, done) => {
		User.findOne({ username })
			.then(user => {
				const isValid = user.validatePassword(password);
				return done(null, isValid ? user : false);
			})
			.catch(e => done(null, false));
	}
);
