const express = require("express");
const router = express.Router();
const FileUpload = require("./../services/file_upload");

const Photo = require("../models/Photo");
const User = require("../models/User");

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect("/login");
};

// ----------------------------------------
// Index
// ----------------------------------------
router.get(["/", "/photos"], loggedInOnly, (req, res) => {
  Photo.find({}).populate("userId").then(photos => {
    res.render("photos/index", { photos, user: req.user });
  });
});

// ----------------------------------------
// New
// ----------------------------------------
router.get("/photos/new", loggedInOnly, (req, res) => {
  res.render("photos/new", { user: req.user });
});

// ----------------------------------------
// Create
// ----------------------------------------
const mw = FileUpload.single("photo[file]"); 

router.post("/photos", mw, (req, res, next) => {

  FileUpload.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    photoName: req.body.photo.name,
    description: req.body.photo.description,
    userId: req.body.userId
  })
    .then(data => {
      console.log(data);
      req.flash("success", "Photo uploaded!");
      res.redirect("/photos");
    })
    .catch(next);
});

// ----------------------------------------
// Show Photo
// ----------------------------------------
router.get("/photos/:id", loggedInOnly, (req, res) => {
  let photo;
  Photo.findOne({ key: req.params.id })
    .populate("userId")
    .then(foundPhoto => {
      photo = foundPhoto;
      return Photo.find({ userId: photo.userId._id }).limit(3);
    })
    .then(photos => {
      photos = photos.filter(eachPhoto => {
        return eachPhoto.key !== photo.key;
      });
      res.render("photos/show", { photo, photos, user: req.user });
    });
});

// ----------------------------------------
// Users Index
// ----------------------------------------
router.get("/users", loggedInOnly, (req, res) => {
  User.find({}).then(users => {
    res.render("users/index", { users, user: req.user });
  });
});

// ----------------------------------------
// Show User
// ----------------------------------------
router.get("/users/:id", loggedInOnly, (req, res) => {
  let selectedUser;
  User.findById(req.params.id)
    .then(foundUser => {
      selectedUser = foundUser;
      return Photo.find({ userId: foundUser._id });
    })
    .then(photos => {
      res.render("users/show", { selectedUser, photos, user: req.user });
    });
});

// ----------------------------------------
// Destroy
// ----------------------------------------
router.delete("/photos/:id", loggedInOnly, (req, res, next) => {
  Photo.findOne({ key: req.params.id }).then(photo => {
    if (req.user._id.toString() === photo.userId.toString()) {
      FileUpload.remove(req.params.id)
        .then(() => {
          res.redirect("/photos");
        })
        .catch(next);
    } else {
      req.flash("error", "You can delete only your own photos!");
      res.redirect("back");
    }
  });
});

module.exports = router;






