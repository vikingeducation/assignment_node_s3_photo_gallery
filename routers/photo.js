const express = require("express");
const router = express.Router();
const FileUpload = require("./../services/fileUpload");

var ownership = function(photos, user) {
  for (var key in photos) {
    if (photos.hasOwnProperty(key)) {
      photos[key].owns = photos[key].user === user.email;
    }
  }
  return photos;
};

module.exports = app => {
  router.get("/", (req, res) => {
    let photos = require("./../data/photos");

    if (!Object.keys(photos).length) {
      photos = 0;
    } else {
      //Add property for ownership
      photos = ownership(photos, req.user);
    }
    res.render("photo/start", { photos });
  });

  router.get("/new", (req, res) => {
    res.render("photo/new");
  });

  const mw = FileUpload.single("photo[file]");
  router.post("/new", mw, (req, res, next) => {
    console.log("Files", req.file);

    FileUpload.upload(
      {
        data: req.file.buffer,
        name: req.file.originalname,
        mimetype: req.file.mimetype
      },
      req.user,
      req.body.photo.description
    )
      .then(data => {
        console.log(data);
        req.flash("success", "Photo created!");
        res.redirect("/");
      })
      .catch(next);
  });

  router.delete("/:name", (req, res, next) => {
    FileUpload.remove(req.params.name)
      .then(() => {
        res.redirect("/");
      })
      .catch(next);
  });

  router.get("/one/:name", (req, res) => {
    let photo = require("./../data/photos")[req.params.name];
    //Add property for ownership
    photo = ownership(photo, req.user);
    res.render("photo/one", { photo });
  });
  return router;
};
