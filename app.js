const express = require("express");
const app = express();
const User = require("./models/User");
const mongoose = require("mongoose");
const mongo = require("./mongo");
const expressSession = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy;
const localStrategy = require("./strategies/local");
const {
  FileUploader,
  mw
} = require("./cloudifyAllTheThingsLikePhotosInThisCaseSinceThatsWhatWeWantToDisplayInOurApp");
const expressHandlebars = require("express-handlebars");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
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
    saveUninitialized: true,
    resave: true,
    secret: process.env.SECRET
  })
);

app.use(passport.initialize());
app.use(passport.session());
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

app.get("/", (req, res) => {
  res.redirect("/photos");
});

app.get("/login", loggedOut, (req, res) => {
  res.render("users/login");
});

app.post(
  "/login",
  loggedOut,
  passport.authenticate("local", {
    successRedirect: "/photos",
    failureRedirect: "/login"
  })
);

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
    // Photo.create({})
    // find User by req.user.id
    // user.photos.push(photo)
    //user.save()
    // .then(()=>{
    res.redirect("/photos");
  });
});

const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

User.create({
  first_name: "a",
  last_name: "a",
  email: "a",
  password: "a"
});

app.listen.apply(app, args);

module.exports = app;
