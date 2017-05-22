const express = require("express");
const router = express.Router();
const FileUpload = require("./../services/file_upload");
const Photo = require("../models/Photo");
const User = require("../models/User");

// ----------------------------------------
// Index
// ----------------------------------------
router.get(["/", "/photos"], (req, res) => {
  Photo.find({}).populate("userId").then(photos => {
    console.log("Photos: ", photos);
    res.render("photos/index", { photos, user: req.user });
  });
});

// ----------------------------------------
// New
// ----------------------------------------
router.get("/photos/new", (req, res) => {
  res.render("photos/new", { user: req.user });
});

// ----------------------------------------
// Create
// ----------------------------------------
const mw = FileUpload.single("photo[file]");
router.post("/photos", mw, (req, res, next) => {
  console.log("Files", req.file);
  console.log("form data", req.body);

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
router.get("/photos/:id", (req, res) => {
  let photo;
  Photo.findOne({ key: req.params.id }).populate("userId")
    .then(foundPhoto => {
      photo = foundPhoto;
      return Photo.find({ userId: photo.userId._id }).limit(3)
    })
    .then(photos => {
      photos = photos.filter((eachPhoto) => {
        return eachPhoto.key !== photo.key
      });
      res.render("photos/show", { photo, photos, user: req.user });     
    });
 
});

// ----------------------------------------
// Users Index
// ----------------------------------------
router.get("/users", (req, res) => {
  User.find({})
    .then(users => {
      res.render("users/index", { users, user: req.user });     
    });
 
});


// ----------------------------------------
// Show User
// ----------------------------------------
router.get("/users/:id", (req, res) => {
  let selectedUser;
  User.findById(req.params.id)
    .then(foundUser => {
      selectedUser = foundUser;
      return Photo.find({ userId: user._id })
    })
    .then(photos => {
      res.render("users/show", { selectedUser, photos, user: req.user });     
    });
 
});

// ----------------------------------------
// Destroy
// ----------------------------------------
router.delete("/photos/:id", (req, res, next) => {
  FileUpload.remove(req.params.id)
    .then(() => {
      res.redirect("/photos");
    })
    .catch(next);
});

module.exports = router;
