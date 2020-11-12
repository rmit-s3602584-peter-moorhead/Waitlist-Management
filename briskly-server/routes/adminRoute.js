var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var passport = require("passport");
var db = require("../database_utils");
var bcrypt = require("bcrypt");
const saltRounds = 10;

const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;
const authorizationAdminMiddleware = require("./authMiddleware")
  .authorizationAdminMiddleware;

//Testing admin register, renders adminRegister.ejs for backend registration
router.get("/adminRegister", function (req, res, next) {
  res.render("adminRegister", { title: "Registration" });
});

router.post(
  "/singleNurseryAdmin",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //store the variable in an array to be appropriate to use
    //in the SQL statement
    var data = {
      number: req.body.id,
    };
    //get the nursery by its id
    db.get_nursery(data, function (err, result) {
      //return the nursery details to the frontend
      res.send(result);
    });
  }
);
router.post(
  "/getAdminNurseries",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //Storing the returned value as a dictionary to send it to the
    //SQL function
    const data = {
      name: req.body.name,
      CRN: req.body.CRN,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      registrationStatus: req.body.status,
      lowerDate: req.body.from,
      upperDate: req.body.to,
      status: req.body.status,
    };

    db.search_nursery(data, function (err, result) {
      //After receiving the results, return the data to the frontend

      //filtering the data with nulls in case something
      //goes wrong in the SQL statement.

      dataToSend = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i]["nurseryName"] != null) {
          dataToSend.push(result[i]);
        }
      }
      res.send({
        nurseries: dataToSend,
      });
    });
  }
);

router.post(
  "/sendNotification",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //send notification

    //return all the emails.
    const data = {
      type: req.body.to,
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
    };

    var allEmails = [];
    db.get_emails(data, function (err, result) {
      //if the admin select 'Parents' and 'Nurseries' then we have
      //to query twice to get their emails

      if (data["type"].length == 2) {
        //call the function twice:
        const types = data["type"];
        //use the first type received
        data["type"] = types[0];
        //get its emails
        db.get_emails(data, function (err, result) {
          //after getting the results update the type
          data["type"] = types[1];
          //add the emails to the array
          for (var i = 0; i < result.length; i++) {
            allEmails.push(result[i].email);
          }
          //get the emails of the second type
          db.get_emails(data, function (err, result) {
            //add the emails to the array
            for (var i = 0; i < result.length; i++) {
              allEmails.push(result[i].email);
            }

            //After receiving the results, return the data to the frontend
            res.send({
              emails: allEmails,
            });
          });
        });
      } else {
        //call it once if there is only 1 type selected
        db.get_emails(data, function (err, result) {
          //store the returned emails in the array
          for (var i = 0; i < result.length; i++) {
            allEmails.push(result[i].email);
          }
          //After receiving the results, return the data to the frontend
          res.send({
            emails: allEmails,
          });
        });
      }
    });
  }
);

router.post(
  "/updatePrices",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //update the 1) user, then nursery, then add account. All of them with the new date

    //storing the data received from the frontend as a dictionary to send it
    //to do SQL queries
    var data = {
      user: {
        activationDate: req.body.activationDate,
        deactivationDate: req.body.deactivationDate,
        userFees: req.body.userFees,
        nurseryFees: req.body.nurseryFees,
        addFees: req.body.accountFees,
      },
      userType: "user",
    };

    //update the fees for the user
    db.updateUserFees(data, function (err, result) {
      //after the user is updated, update the user type in the dictionary to nursery
      //in order to update the nursery fees
      data["userType"] = "nursery";

      //update the nursery fees
      db.updateNurseryFees(data, function (err, result) {
        //after the user is updated, update the user type in the dictionary to additional
        //to update the fees for adding subaccounts
        data["userType"] = "additional";

        //update the nursery fees
        db.updateAddFees(data, function (err, result) {
          //send a message that the process has been completed.
          res.send("COMPLETED THE UPDATES");
        });
      });
    });
  }
);

router.post(
  "/prices",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //get the current prices setting from the database
    db.get_fees(function (err, result) {
      //add the prices to a clean dictionary
      //to be returned to the frontend.
      var dataToReturn = {
        validFrom: result[0]["validFrom"],
        validTo: result[0]["validTo"],
        user: result[0]["amount"],
        nursery: result[1]["amount"],
        add: result[2]["amount"],
      };

      //send the price dictionary to the frontend to be shown to the Admin
      res.send(dataToReturn);
    });
  }
);

router.post(
  "/adminDeclineNursery",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //storing the data received from the frontend
    data = {
      nurseryNumber: req.body.nurseryNumber,
      status: 3,
    };
    //change the status of the nursery by using the nursery
    //number that we received from the frontend.
    db.change_nursery_status(data, function (err, result) {
      //send a success message to the frontend because the status
      //of the nursery has been changed
      res.send({ message: "success" });
    });
  }
);

router.post(
  "/adminApproveNursery",
  authenticationMiddleware(),
  authorizationAdminMiddleware(),
  function (req, res, next) {
    //storing the data received from the frontend
    data = {
      nurseryNumber: req.body.nurseryNumber,
      status: 1,
    };
    //change the status of the nursery by using the nursery
    //number that we received from the frontend.
    db.change_nursery_status(data, function (err, result) {
      //send a success message to the frontend because the status
      //of the nursery has been changed
      res.send({ message: "success" });
    });
  }
);

router.post("/adminRegister", function (req, res, next) {
  //storing the data received. Although some are fixed
  //just to fill out the database row.
  const data = {
    PhoneNumber: 12345,
    AlternatePhone: 123,
    email: req.body.email,
    password: req.body.password,
    lastLogin: "2020-9-1",
    active: "1",
  };

  //encrypting the admin's password
  bcrypt.hash(data["password"], saltRounds, function (err, hash) {
    data["password"] = hash;

    db.add_admin(data, function (err, result) {
      //now the admin has been added to the system
      console.log("Admin added");
    });
  });
});

module.exports = router;
