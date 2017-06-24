// Routes to build
// /users <- index
// /users/:id <- deets about a user

const express = require("express");
const router = express.Router();
const models = require("./../models");
const User = models.User;
const Photo = models.Photo;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  User.find().then(users => {
    res.render("users/index", { user: req.user, users });
  });
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", (req, res) => {
  User.findById(req.params.id).populate("photos").then(result => {
    console.log(result);
    res.render("users/show", { user: req.user, viewedUser: result });
  });
});

module.exports = router;
