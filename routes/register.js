const express = require("express");
const router = express.Router();
const models = require("./../models");
const User = models.User;
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("register/index");
});

router.post("/", (req, res, next) => {
  const { fname, lname, email, password } = req.body;
  const user = new User({ fname, lname, email, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

module.exports = router;
