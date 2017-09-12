const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");

//main page
router.get("/", (req, res) => {
  res.render("index");
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
    const user = await User.registerNewUser(req.body.username);
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

//logout handler
router.get(h.logoutPath(), function(req, res) {
  req.session.user = {};
  res.redirect("/");
});

router.use((err, res, req, next) => {
  console.error(err.stack);
  res.status(500).end(err.stack);
});

module.exports = router;
