const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");

const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect("/login");
};

router.get("/", loggedInOnly, (req, res) => {
	res.render("photos/index");
});

router.get("/new", loggedInOnly, (req, res) => {
	res.render("photos/new");
});

const mw = upload.single("photo[file]");
router.post("/photos", mw, (req, res, next) => {
	console.log("File:", req.file);
	res.redirect("new");
});

module.exports = router;
