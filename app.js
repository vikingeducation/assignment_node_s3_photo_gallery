const express = require("express");
const app = express();

require("dotenv").config();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var morgan = require("morgan");
app.use(morgan("tiny"));

var expressHandlebars = require("express-handlebars");
var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

const {
  FileUploader,
  mw
} = require("./cloudifyAllTheThingsLikePhotosInThisCaseSinceThatsWhatWeWantToDisplayInOurApp");

app.get("/", (req, res) => {
  res.redirect("/photos");
});

app.get("/photos", (req, res) => {
  res.render("photos/index");
});

app.get("/photos/new", (req, res) => {
  res.render("photos/new");
});

app.post("/photos/new", mw, (req, res) => {
  FileUploader.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  }).then(data => {
    res.redirect("/photos");
  });
});

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";
var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});
app.listen.apply(app, args);

module.exports = app;
