const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");

//main page
router.get("/", (req, res) => {
  req.session.user
    ? res.render("index", { user: req.session.user })
    : res.redirect("/login");
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
    console.log("Hit the route");
    const user = await User.create({ username: req.body.username });
    console.log("Created a user...");
    req.session.user = user;
    console.log;
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

router.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash("error", `${err.message}`);
  res.redirect("/");
});

module.exports = router;
