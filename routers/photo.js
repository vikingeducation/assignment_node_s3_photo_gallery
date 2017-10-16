const express = require("express");
const router = express.Router();
const FileUpload = require("./../services/fileUpload");

module.exports = app => {
  router.get("/", (req, res) => {
    let photos = require("./../data/photos");
    console.log(photos);
    if (JSON.stringify(photos).length < 4) {
      photos = 0;
    }
    res.render("photo/start", { photos });
  });

  router.get("/new", (req, res) => {
    res.render("photo/new");
  });

  const mw = FileUpload.single("photo[file]");
  router.post("/photos", mw, (req, res, next) => {
    console.log("Files", req.file);

    FileUpload.upload({
      data: req.file.buffer,
      name: req.file.originalname,
      mimetype: req.file.mimetype
    })
      .then(data => {
        console.log(data);
        req.flash("success", "Photo created!");
        res.redirect("/");
      })
      .catch(next);
  });

  router.delete("/photos/:name", (req, res, next) => {
    FileUpload.remove(req.params.name)
      .then(() => {
        res.redirect("/");
      })
      .catch(next);
  });
  return router;
};
