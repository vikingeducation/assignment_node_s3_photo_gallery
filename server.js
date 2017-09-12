const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bodyParser = require("body-parser");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: false }));
const exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: "views"
  })
);

app.set("view engine", "handlebars");
require("dotenv").config();

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/photos", upload.single("photo"), (req, res, next) => {
  console.log(req.file);
  var params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: "test_file",
    Body: req.file.buffer
  };

  s3.upload(params, function(err, data) {
    console.log(err, data);
  });
  res.redirect("back");
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
