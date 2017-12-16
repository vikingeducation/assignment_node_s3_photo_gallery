const User = require("../models/User");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const localStrategy =  new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    User.findOne({ email }, function(err, user) {
      if (err) return done(err);
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: "Invalid email/password" });
      }
      return done(null, user);
    });
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(localStrategy);
