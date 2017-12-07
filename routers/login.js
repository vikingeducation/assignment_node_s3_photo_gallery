const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");

const passport = require("passport");

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect("/");
};

// login view
router.get("/login", loggedOutOnly, (req, res) => {
	res.render("users/login");
});

// register view
router.get("/register", loggedOutOnly, (req, res) => {
	res.render("users/register");
});

// logout
router.get("/logout", loggedInOnly, (req, res) => {
	req.logout();
	res.redirect("/login");
});

// login as existing user
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

// Show User
const onShow = (req, res) => {
	res.render("users/show", { user: req.user });
};

router.get("/", loggedInOnly, onShow);
router.get("/user", loggedInOnly, onShow);

router.post("/register", loggedOutOnly, (req, res, next) => {
	User.create(req.body)
		.then(user => {
			res.redirect("/");
		})
		.catch(e => {
			if (e.errors) {
				console.log(e.errors);
				res.redirect("back");
			} else {
				next(e);
			}
		});
});

module.exports = router;
