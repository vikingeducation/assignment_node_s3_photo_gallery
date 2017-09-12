const express = require("express");
const app = express();
const User = require("./models/User");
const mongoose = require("mongoose");
const mongo = require("./mongo");
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

require("dotenv").config();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var morgan = require("morgan");
app.use(morgan("tiny"));

var expressHandlebars = require("express-handlebars");
var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => {
      next();
    });
  }
});

app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET
  })
);

app.use(passport.initialize());
app.use(passport.session());
const localStrategy = require("./strategies/local");
passport.use(new LocalStrategy(localStrategy));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};
const loggedOut = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/photos");
  }
};

const {
  FileUploader,
  mw
} = require("./cloudifyAllTheThingsLikePhotosInThisCaseSinceThatsWhatWeWantToDisplayInOurApp");

app.get("/", (req, res) => {
  res.redirect("/photos");
});

app.get("/login", (req, res) => {
  res.render("/users/login");
});

app.get("/photos", loggedIn, (req, res) => {
  res.render("photos/index");
});

app.get("/photos/new", loggedIn, (req, res) => {
  res.render("photos/new");
});

app.post("/photos/new", loggedIn, mw, (req, res) => {
  FileUploader.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  }).then(data => {
    res.redirect("/photos");
  });
});

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";
var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});
app.listen.apply(app, args);

module.exports = app;
