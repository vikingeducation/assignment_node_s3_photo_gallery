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
const { addUser, addUserPhoto } = require("./controllers/User");
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const { local, serializeUser, deserializeUser } = require("./strategies");

passport.use(local);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, password, email } = req.body;
  let user = await addUser({
    fname: firstName,
    lname: lastName,
    email: email,
    password: password,
    photos: []
  });
  if (user) {
    res.redirect("/login");
  }
});

app.get("");

app.post("/photos/new", upload.single("photo"), async (req, res, next) => {
  var params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: "test_file",
    Body: req.file.buffer
  };

  s3.upload(params, function(err, data) {
    console.log(err, data);
  });

  try {
    const photo = await addUserPhoto(data.location, req.user._id);
  } catch (err) {
    console.log(err);
  }

  res.redirect("back");
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
