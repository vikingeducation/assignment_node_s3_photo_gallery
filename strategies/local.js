const User = require("../models/User");

const localStrategy = (username, password, done) => {
  User.findOne({
    email: username
  }).then(user => {
    if (user && user.validatePassword(password)) {
      done(null, user);
    } else {
      done(null, false, { message: "validation failed" });
    }
  });
};

module.exports = localStrategy;
