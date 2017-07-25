const express = require("express");
const app = express();

// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
    for (let key in req.query) {
      req.body[key] = decodeURIComponent(req.query[key]);
    }
  } else if (typeof req.body === "object" && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Static Public Files
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
const highlight = require("cli-highlight").highlight;

// Add :data format token
// to `tiny` format
let format = [
  ":separator",
  ":newline",
  ":method ",
  ":url ",
  ":status ",
  ":res[content-length] ",
  "- :response-time ms",
  ":newline",
  ":newline",
  ":data",
  ":newline",
  ":separator",
  ":newline",
  ":newline"
].join("");

// Use morgan middleware with
// custom format
app.use(morgan(format));

// Helper tokens
morgan.token("separator", () => "****");
morgan.token("newline", () => "\n");

// Set data token to output
// req query params and body
morgan.token("data", (req, res, next) => {
  let data = [];
  ["query", "params", "body", "session"].forEach(key => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      data.push(`${capKey}: ${value}`);
    }
  });
  data = highlight(data.join("\n"), {
    language: "json",
    ignoreIllegals: true
  });
  return `${data}`;
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
const models = require("./models");
const User = models.User;

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const h = require("./helpers").registered;

const hbs = expressHandlebars.create({
  helpers: h,
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      User.findOne({ email }, function(err, user) {
        console.log(user);
        if (err) return done(err);
        if (!user || !user.validPassword(password)) {
          return done(null, false, { message: "Invalid email/password" });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// ----------------------------------------
// Routes
// ----------------------------------------
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");
const photos = require("./routes/photos");
const users = require("./routes/users");

app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);
app.use("/photos", photos);
app.use("/users", users);
app.use("/", (req, res) => {
  if (req.user) {
    res.redirect("/photos");
  } else {
    res.redirect("/login");
  }
});

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 4000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {});

app.listen.apply(app, args);

module.exports = app;
