const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");

module.exports = app => {
  router.get("/", (req, res) => {
    User.find({}).then(users => {
      res.render("users/index", { users });
    });
  });

  router.get("/one/:id", (req, res) => {
    let photosAll = require("./../data/photos");
    let photos = {};
    User.findById(req.params.id).then(user => {
      for (var key in photosAll) {
        if (photosAll.hasOwnProperty(key)) {
          if (photosAll[key].user === user.email) {
            photos[key] = photosAll[key];
          }
        }
      }
      res.render("users/show", { user, photos });
    });
  });
  return router;
};
