var express = require("express");
var router = express.Router();
var passport = require("passport");

var bcrypt = require("bcrypt");
const saltRounds = 10;

const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;
const authorizationAdminMiddleware = require("./authMiddleware")
  .authorizationAdminMiddleware;

//FORGOT PASSPWORD
router.post("/forgotPassword", (req, res, next) => {});

//CHANGE PASSWORD AFTER FORGOTTEN EMAIL RECIEVED
router.post("/resetPassword", (req, res, next) => {});

module.exports = router;
