const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

module.exports = () => {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use(
		new LocalStrategy(function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false);
				}
				if (user.password !== password) {
					return done(null, false);
				}
				return done(null, user);
			});
		})
	);
};
