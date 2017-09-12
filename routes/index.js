const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User, Photo } = require("../models");
const FileUpload = require("../services/file_upload");

//main page
router.get("/", async (req, res, next) => {
  try {
    const user = req.session.user;
    console.log("User: ", req.session.user);

    let photos = await Photo.find().populate("user");
    photos = !user
      ? photos
      : photos.map(photo => {
          console.log("single photo: ", photo);
          photo.currentUser = photo.user.id === user._id;
          return photo;
        });

    user ? res.render("index", { user, photos }) : res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

//login view
router.get("/login", (req, res) => {
  res.render("login");
});

//login handler
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
});

//register view
router.get(h.registerPath(), (req, res) => {
  res.render("register");
});

//register handler
router.post(h.registerPath(), async (req, res, next) => {
  try {
    const user = await User.create({ username: req.body.username });
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

//logout handler
router.get(h.logoutPath(), function(req, res) {
  req.session.user = null;
  res.redirect("/");
});

// ----------------------------------------
// Create
// ----------------------------------------
const mw = FileUpload.single("photo");

router.post("/photos", mw, async (req, res, next) => {
  try {
    const user = await FileUpload.upload(
      {
        data: req.file.buffer,
        name: req.file.originalname,
        mimetype: req.file.mimetype
      },
      req.session.user
    );
    req.session.user = user ? user : req.session.user;
    req.flash("success", "Photo created!");
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------
// Destroy
// ----------------------------------------
router.delete("/photos/:id", async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);
  await FileUpload.remove(photo.name);
  try {
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash("error", `${err.message}`);
  res.redirect("/");
});

module.exports = router;
