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
const {
  addUser,
  addUserPhoto,
  getUserPhotos,
  getUsers
} = require("./controllers/User");
const { addPhoto, getPhotos } = require("./controllers/Photo");
const expressSession = require("express-session");
const shortId = require("shortid");

const { loggedInOnly, loggedOutOnly } = require("./middleware");

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

app.get("/", async (req, res) => {
  const photos = await getPhotos();
  const users = await getUsers();
  res.render("photos", { photos, users });
});

app.get("/upload", loggedInOnly, (req, res) => {
  res.render("index");
});

app.get("/register", loggedOutOnly, (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { fname, lname, password, email } = req.body;
  let user = await addUser({
    fname,
    lname,
    email,
    password,
    photos: []
  });
  if (user) {
    res.redirect("/login");
  }
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.post("/photos/new", upload.single("photo"), async (req, res, next) => {
  const key = shortId.generate();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: req.file.buffer
  };

  try {
    s3.upload(params, async function(err, data) {
      const photo = await addPhoto(data.Location, data.key, req.user._id);
      await addUserPhoto(req.user._id, photo._id);
      return res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/:id", async (req, res) => {
  let showable;
  if (req.user && req.user.id === req.params.id) {
    showable = true;
  }
  try {
    const user = await getUserPhotos(req.params.id);
    return res.render("photos", { user: user, photos: user.photos, showable });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
