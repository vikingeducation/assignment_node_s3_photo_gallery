const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const Photo = mongoose.model("Photo");

const passport = require("passport");

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect("/login");
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

// get user show page
router.get("/user/:id", loggedInOnly, (req, res) => {
	var thisUser;
	User.findOne({ _id: req.params.id })
		.then(thatUser => {
			thisUser = thatUser;
			return Photo.find({ userId: req.params.id });
		})
		.then(photos => {
			res.render("users/show", { photos, thisUser });
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
});

router.get("/user", loggedInOnly, (req, res) => {
	res.redirect(`user/${req.user.id}`);
});

module.exports = router;
