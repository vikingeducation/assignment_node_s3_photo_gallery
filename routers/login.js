const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");

module.exports = middlewares => {
  const { loggedInOnly, loggedOutOnly } = middlewares;

  router.get("/", loggedInOnly, (req, res) => {
    res.redirect("/photos");
  });
  router.get("/login", loggedOutOnly, (req, res) => {
    res.render("login/login");
  });
  router.get("/register", loggedOutOnly, (req, res) => {
    res.render("login/register");
  });
  router.post("/register", (req, res) => {
    const userParams = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    };
    User.create(userParams)
      .then(user => {
        req.login(user, function() {
          res.redirect("/login");
        });
      })
      .catch(e => {
        console.log(e);
        res.redirect("/");
      });
  });
  // Allow logout via GET and DELETE
  const onLogout = (req, res) => {
    // Passport convenience method to logout
    req.logout();
    // Ensure always redirecting as GET
    req.method = "GET";
    res.redirect("/login");
  };
  router.get("/logout", loggedInOnly, onLogout);
  router.delete("/logout", loggedInOnly, onLogout);
  return router;
};
