const express = require('express');
const router = express.Router();
const passport = require('passport');
const { loggedOutOnly } = require('../services/session');

router.get('/', (req, res) => res.redirect('/login'));

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/new");
});

router.post('/login', loggedOutOnly,
  passport.authenticate("local", {
    successRedirect: "/photos",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
