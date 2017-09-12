require("dotenv").config();
const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bodyParser = require("body-parser");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { DB_URL } = process.env;
const db = require("./config")(DB_URL);
const { addUser } = require("./controllers/User");
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

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

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  let user = await addUser(req.body);
  if (user) {
    res.session.user = user;
    res.redirect("/photos");
  }
});

app.post("/photos", upload.single("photo"), (req, res, next) => {
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
