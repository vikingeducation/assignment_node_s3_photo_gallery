const express = require("express");
const router = express.Router();
const FileUpload = require("./../services/file_upload");
const Photo = require("../models/Photo");

// ----------------------------------------
// Index
// ----------------------------------------
router.get(["/", "/photos"], (req, res) => {
  Photo.find({})
  .populate("userId")
  .then((photos) => {
    console.log("Photos: ", photos);
    res.render("photos/index", { photos, user: req.user});    
  })

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
  console.log("form data", req.body)

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
