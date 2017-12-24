const express = require("express");
const router = express.Router();

const Photo = require("../models/Photo");
const User = require("../models/User");

const passport = require("passport");

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

// 1
router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/photos");
  } else {
    res.redirect("/login");
  }
});

// 2
router.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/login");
});

router.get("/register", loggedOutOnly, (req, res) => {
  res.render("sessions/register");
});

// 3
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// 4
router.post("/register", (req, res, next) => {
  User.create(req.body)
	.then(user => {
		res.redirect("/");
	})
	.catch(e => {
		if (e.errors) {
			req.flash("error", "Password must be 8 characters long");
			res.redirect("back");
		} else {
			next(e);
		}
	});
});

// 5
router.get("/logout", loggedInOnly, function(req, res) {
  req.logout();
  res.redirect("/");
});


module.exports = router;
