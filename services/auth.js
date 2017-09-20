const express = require('express');
const app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Express Session
// ----------------------------------------
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.secret || "midway hackathon",
    saveUninitialized: false,
    resave: false
  })
)

// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const User = require("../models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/s3-assignment");

// 2
const LocalStrategy = require("passport-local").Strategy;

// 3
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      console.log(user);
      if (err) return done(err);
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: "Invalid username/password" });
      }
      return done(null, user);
    });
  })
);

//4
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// 1
app.get("/", (req, res) => {
  if (req.user) {
    res.render("photos/index", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

// 2
app.get("/login", (req, res) => {
  res.render("sessions/login");
});

app.get("/register", (req, res) => {
  res.render("sessions/register");
});


// 3
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// 4
app.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/"); });
  });
});

// 5
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = app;