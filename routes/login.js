const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const passport = require('passport');

router.get("/", (req, res) => {
  res.render("login/index.handlebars");
});

router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

module.exports = router;