var express = require("express");
var router = express.Router();
var passport = require("passport");
var db = require("../database_utils");
var bcrypt = require("bcrypt");
const saltRounds = 10;

const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;
const authorizationAdminMiddleware = require("./authMiddleware")
  .authorizationAdminMiddleware;

router.post("/searchNursery", function (req, res, next) {
  nursery_search = {
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    ChildcareReduction: req.body.ChildCareFeedReduction,
    EarlyChildhoodEducationCertification: req.body.ECE,
    EarlyLearningFrameworkCertification: req.body.ELF,
    SpecialNeeds: req.body.specialNeeds,
    LicensedFamily: req.body.LicensedFamily,
    LicensedGroup: req.body.LicensedGroup,
    status: 1, //only APPROVED nurseries
  };

  //to call the database and get the nurseries that matches
  //the details that we received from the frontend.
  db.search_nursery_user(nursery_search, function (err, nursery_search) {
    if (err) {
      console.log(err);
      return { message: "failure" };
    }
    //to store the data that will be returned to the frontend
    toReturn = [];
    //making sure that there are no null values in any of the returned results
    for (var i = 0; i < nursery_search.length; i++) {
      if (nursery_search[i]["nurseryName"] != null) {
        toReturn.push(nursery_search[i]);
      }
    }
    //sending the result to the frontend
    res.json(toReturn);
  });

  router.post("/singleNurserySearch", function (req, res, next) {
    //we received the id of the nursery and return all of its
    //data to the frontend.

    //store the variable in an array to be appropriate to use
    //in the SQL statement
    var data = {
      number: req.body.id,
    };

    //get the nursery by its id
    db.get_nursery(data, function (err, result) {
      //send the nursery details to the frontend
      res.send(result);
    });
  });

  router.post(
    "/getParentAndNurseryEmails",
    authenticationMiddleware(),
    function (req, res, next) {
      //getting the parent email based on the childId received
      //and getting the nursery email based on its name

      //store the variable in an array to be appropriate to use
      //in the SQL statement
      var data = {
        childId: req.body.child,
        name: req.body.name,
      };

      //get the parent and nursery emails
      db.get_parent_email(data, function (err, result) {
        //Now we have the parent email
        parentEmail = result[0]["Email"];

        db.get_nursery_email(data, function (err, result) {
          //Now we have the nursery email
          nurseryEmail = result[0]["Email"];
          //send the emails to the frontend.
          res.send([parentEmail, nurseryEmail]);
        });
      });
    }
  );
});

module.exports = router;
