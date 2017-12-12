const express = require("express");
const app = express();

// env
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// User and Mongoose code
const mongoose = require("mongoose");
var models = require("./models");
var User = mongoose.model("User");

// Connect to our mongo server
app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// express
const cookieSession = require("cookie-session");

app.use(
	cookieSession({
		name: "session",
		keys: ["asdf1234567890qwer"]
	})
);

// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy Set Up
const localStrategy = require("./services/local");
passport.use(localStrategy);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
	// Find the user in the database
	User.findById(id)
		.then(user => done(null, user))
		.catch(e => done(null, false));
});

app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// Method Override
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
	methodOverride(
		getPostSupport.callback,
		getPostSupport.options // { methods: ['POST', 'GET'] }
	)
);

// Referrer
app.use((req, res, next) => {
	req.session.backUrl = req.header("Referer") || "/";
	next();
});

// Logging
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Set up express-handlebars
const exhbs = require("express-handlebars");

const hbs = exhbs.create({
	partialsDir: "views/",
	defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// routes
var loginRouter = require("./routers/login");
app.use("/", loginRouter);

var photosRouter = require("./routers/photos");
app.use("/", photosRouter);

// Start our app
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
	console.log(`Listening: http://${host}:${port}\n`);
});

app.listen.apply(app, args);

// Error Handling
app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}

	res.status(500).render("errors/500", { error: err.stack });
});
