var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var passport = require("passport");
var rateLimit = require("express-rate-limit");

const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;

//rate limiter so the login can't be brute forced
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attemps, try again later",
});

//renders home.ejs file for server side login and registration
router.get("/", function (req, res) {
  res.render("home", { title: "Home" });
});

//render profile.ejs for server side authentication test and session info get
router.get("/profile", authenticationMiddleware(), function (req, res) {
  res.render("profile", { title: "Profile", user: req.user });
});

//renders login.ejs for server side login
router.get("/login", loginLimiter, function (req, res) {
  res.render("login", { title: "Login" });
});

//passport authenticates the user with the local strategy defined in the app.js file
router.post("/login", passport.authenticate("local"), loginLimiter, function (
  req,
  res
) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json({ user: req.session.passport.user });
});
//logout function, passport.js has inbuilt methods logout() and session.destroy() which deletes the session from the browser and the session store
router.get("/logout", function (req, res) {
  req.logout();
  req.session.destroy();
  res.send("logged out");
});

passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

module.exports = router;
