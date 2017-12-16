const User = require("../models/User");

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/users");
  }
};

const setCurrentUser = (req, res, next) => {
  if (req.user) {
    User.findById(req.user.id)
      .then(user => {
        res.locals.currentUser = user;
        next();
      });
  } else {
    next();
  }
};

module.exports = {
  loggedOutOnly,
  loggedInOnly,
  setCurrentUser
};
