if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);

// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

// Use morgan middleware with
app.use(morganToolkit());

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Services
// ----------------------------------------

// Require passport, strategies and User model
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models").User;

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Create local strategy
const localStrategy = new LocalStrategy(
  {
    // Set username field to email
    // to match form
    usernameField: "email"
  },
  (email, password, done) => {
    // Find user by email
    User.findOne({ email: email })
      .then(user => {
        // The user is valid if the password is valid
        const isValid = user.validatePassword(password);

        // If the user is valid pass the user
        // to the done callback
        // Else pass false
        return done(null, isValid ? user : false);
      })
      .catch(e => done(null, false));
  }
);

// Use the strategy middlewares
passport.use(localStrategy);

// Serialize and deserialize the user
// with the user ID
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  // Find the user in the database
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

// ----------------------------------------
// Session Helper Middleware
// ----------------------------------------

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    return next();
  }
};

const loginRouter = require("./routers/login")({
  loggedInOnly,
  loggedOutOnly
});
app.use("/", loginRouter);

app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("danger", "Wrong Email/Password");
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome ${user.fname} ${user.lname}`);
      return res.redirect("/photos");
    });
  })(req, res, next);
});
// ----------------------------------------
// Routes
// ----------------------------------------
const userRouter = require("./routers/user")(app);
app.use("/users", loggedInOnly, userRouter);
const photoRouter = require("./routers/photo")(app);
app.use("/photos", loggedInOnly, photoRouter);
app.use("/", loginRouter);

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render("errors/500", { error: err });
});
