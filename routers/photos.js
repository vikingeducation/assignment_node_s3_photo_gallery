const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const Photo = mongoose.model("Photo");

const FileUpload = require("./../services/file_upload");

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect("/login");
};

// get photos index page
router.get("/", loggedInOnly, (req, res) => {
	Photo.find({})
		.populate("userId")
		.then(photos => {
			console.log("photos:", JSON.stringify(photos, 0, 2));
			res.render("photos/index", { photos });
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
});

// get new file form page
router.get("/new", loggedInOnly, (req, res) => {
	res.render("photos/new");
});

// upload a new photo post route
const mw = FileUpload.single("photo[file]");
router.post("/photos", mw, (req, res, next) => {
	console.log("File:", req.file);

	// upload
	FileUpload.upload({
		data: req.file.buffer,
		name: req.file.originalname,
		mimetype: req.file.mimetype,
		photoName: req.body.photo.name,
		desc: req.body.photo.desc,
		userId: req.body.userId
	})
		.then(data => {
			console.log(data);
			res.redirect("/");
		})
		.catch(next);
});

// delete a photos
router.delete("photos/:id", (req, res, next) => {
	FileUpload.remove(req.params.id)
		.then(() => {
			res.redirect("/photos");
		})
		.catch(next);
});

// photos show
router.get("/photo/:id", (req, res, next) => {
	Photo.findOne({ _id: req.params.id })
		.populate("userId")
		.then(photo => {
			res.render("photos/show", { photo });
		})
		.catch(next);
});

module.exports = router;
