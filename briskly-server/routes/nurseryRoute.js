var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

var bcrypt = require("bcrypt");
const saltRounds = 10;
var db = require("../database_utils");

//authentication middleware to check valid user is logged in
const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;
const authorizationNurseryMiddleware = require("./authMiddleware")
  .authorizationNurseryMiddleware;

//View Enrollment queue
router.post(
  "/getAllApplicants",
  authenticationMiddleware(),
  authorizationNurseryMiddleware(),
  function (req, res) {
    //status reference
    //0=>waiting,
    //1=> accept,
    //2=> postpone,
    //3=> declined,

    //storing the data received from the frontend which is just
    //the userId of the logged in nursery
    dataReceived = {
      id: req.body.token.user_id,
    };
    //getting the nurseryNumber
    db.get_nurseryNumber(dataReceived, function (err, result) {
      //now we have the nursery's number in the DB

      //storing it
      const nurseryNumber = result[0]["nurseryNumber"];
      //passing the nursery number here to get all the children who are
      //applied to this nursery who still need their status to be updated
      //from "Waiting"
      db.get_All_Applied_ChildrenIds(
        { nurseryNumber: nurseryNumber },
        function (err, result) {
          //now we have all the children ids who are in this nursery
          applyData = result;
          var allChildrenIds = [];
          //we store the children ids in an array to be used next
          for (var i = 0; i < result.length; i++) {
            allChildrenIds.push(result[i]["childID"]);
          }
          //if the length of the array that holds the childrenIds
          //if zero. meaning that there are no children applied to
          //this nursery or on the status "Waiting" then we return a
          //no child found message.
          if (allChildrenIds.length == 0) {
            res.send({ message: "no child found" });
            return;
          }

          //now we get the children information based on the child ids that
          //were stored from above.

          db.get_child_basedOnChildId({ childIds: allChildrenIds }, function (
            err,
            result
          ) {
            //now we have everything we need::::

            var dataToReturn = [];

            //now we loop through them and store their data in the array above
            //and also filter out the data and make 0 be returned as No...etc
            for (var i = 0; i < result.length; i++) {
              for (var y = 0; y < applyData.length; y++) {
                //if the child from the apply table id matches the one from the child table
                if (applyData[y]["childID"] == result[i]["childID"]) {
                  //then we set the data now:

                  //storing child information to be shown to the nursery
                  //in the Nursery Requests page
                  appointmentDate = applyData[y]["appointmentDate"];
                  fName = result[i]["FirstName"];
                  sName = result[i]["Surname"];
                  name = fName + " " + sName;
                  siblings = result[i]["hasSibling"];
                  childId = result[i]["childID"];
                  specialNeeds = result[i]["specialNeedsHandling"];

                  //cleaning up the data.
                  if (siblings == 0) {
                    siblings = "No";
                  } else {
                    siblings = "yes";
                  }
                  if (specialNeeds == 0) {
                    specialNeeds = "No";
                  } else {
                    specialNeeds = "Yes";
                  }
                  if (appointmentDate == null) {
                    appointmentDate = "None";
                  } else {
                    //fix the way the date looks so that it is readable
                    appointmentDate = String(appointmentDate);
                    indexOfT = String(appointmentDate).indexOf("GMT");
                    appointmentDate = appointmentDate.substring(
                      0,
                      indexOfT - 1
                    );
                  }
                  //storing the data in the array dataToReturn
                  //to be returned to the frontend later
                  dataToReturn.push([
                    childId,
                    name,
                    siblings,
                    specialNeeds,
                    appointmentDate,
                  ]);
                }
              }
            }

            //end of data processing

            //now send it to the frontend
            res.send({
              data: dataToReturn,
              message: "success",
            });
          });
        }
      );
    });
  }
);

//when a parent applied to a nursery the nursery uses this method to decline the application
router.post("/declineChild", function (req, res) {
  //gets the nursery id and which child they want to remove from its application queue

  //storing the received data from the frontend in the data dictionary
  data = {
    id: req.body.token.user_id,
    childId: req.body.childId,
  };
  //getting the nursery number by using the userId.
  db.get_nurseryNumber(data, function (err, result) {
    //now we have the nursery number

    data["status"] = 3;
    data["nurseryNumber"] = result[0]["nurseryNumber"];

    db.respond_to_application(data, function (err, results) {
      //now we update the application to the declined status.

      //in case of an error
      if (err) {
        console.log(err);
        res.send({ message: "failure" });
      }

      //send a message to the frontend
      res.send({ message: "success" });
    });
  });
});

router.post(
  "/scheduleMeeting",
  authenticationMiddleware(),
  authorizationNurseryMiddleware(),
  function (req, res) {
    //Update the meeting in the database and an email will
    //automatically be sent to the parent front the frontend
    //by sending the details of the parent from here

    //Storing the date and time.
    date = req.body.date + " " + req.body.time;
    //creating a date object with the date and time together
    datObj = new Date(date);
    //stroing the data received from the frontend AND the cleaned date
    data = {
      id: req.body.token["user_id"],
      childId: req.body.childId,
      date: date,
    };
    //first we get the nursery number by using the userId in the table
    db.get_nurseryNumber(data, function (err, result) {
      //now we have the nurseryNumber
      const nurseryNumber = result[0]["nurseryNumber"];
      data["nurseryNumber"] = nurseryNumber;
      //no we update the apply table with the new date.
      db.schedule_meeting(data, function (err, result) {
        //now that the data has been updated we now get the parent email
        //address to notify him of those changes.
        db.get_parent_email(data, function (err, result) {
          //now that we have the email of the parent
          //we send it back to the frontend with a sucess
          //message with it.
          const email = result[0]["Email"];
          //now we get the nursery name for a good lookin' email
          db.get_nursery_name(data, function (err, result) {
            const name = result[0]["NurseryName"];
            data["name"] = name;
            db.get_nursery_email(data, function (err, result) {
              //now we have al the data to the frontend
              res.send({
                message: "success",
                email: email,
                name: name,
                nurseryEmail: result[0]["Email"],
                date: date,
              });
            });
          });
        });
      });
    });
  }
);

router.post("/acceptChild", function (req, res) {
  //status reference
  //0=>waiting,
  //1=> accept,
  //2=> postpone,
  //3=> declined,

  //here we update the child status in the nursery with the "accepted" status

  //storing the data receievd from the frontend
  data = {
    id: req.body.token.user_id,
    childId: req.body.childId,
  };

  db.get_nurseryNumber(data, function (err, result) {
    //now we have the nursery number
    data["status"] = 1;
    data["nurseryNumber"] = result[0]["nurseryNumber"];

    //now we update the status of the application to accepted.
    db.respond_to_application(data, function (err, results) {
      if (err) {
        console.log(err);
        res.send({ message: "failure" });
      }

      res.send({ message: "success" });
    });
  });
});

router.post(
  "/sendNurseryNotification",
  authenticationMiddleware(),
  authorizationNurseryMiddleware(),
  function (req, res) {
    //send notifications to parents

    //return all the emails.
    const data = {
      type: "parent",
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
      userId: req.body.token.user_id,
    };
    var allEmails = [];

    //call it once if there is only 1 type selected
    db.get_emails(data, function (err, result) {
      //store the returned emails in the array
      for (var i = 0; i < result.length; i++) {
        allEmails.push(result[i].email);
      }

      //now get the email of the nursery sending the email
      userEmailData = {
        id: req.body.token.user_id,
      };

      db.get_user_email(userEmailData, function (err, result) {
        //now we send the data back to the user
        //After receiving the results, return the data to the frontend
        const userEmail = result[0]["Email"];

        db.get_nursery_name(userEmailData, function (err, result) {
          res.send({
            emails: allEmails,
            userEmail: userEmail,
            name: result[0]["NurseryName"],
          });
        });
      });
    });
  }
);

//this function is used to format the
//date that is received from the frontend to
//a good formate to be stored in the database
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

//register a new nursery, takes all the inputs from the frontend and parses them into the nursery_data object to be given to the sql query

router.post("/nurseryRegister", function (req, res, next) {
  //Getting today's date
  var date = new Date();
  year = date.getFullYear();
  month = date.getMonth();
  day = date.getDay();
  //updating the date format
  newDate = new Date(year, month, day);
  newDate = formatDate(newDate);
  //storing all of the received data from the frontend
  //to this dictionary object to be passed to the function
  //that will add it to the backend
  nursery_data = {
    NurseryName: req.body.nurseryName,
    StreetAddress: req.body.streetAddress,
    City: req.body.city,
    State: req.body.state,
    MainPhone: req.body.phoneNumber,
    ContactPhone: req.body.phoneNumber,
    Email: req.body.email,
    role: "nursery",
    NurseryPassword: req.body.password,
    CommercialRegistrationNumber: req.body.crn,
    EarlyChildhoodEdcuationCertification: req.body.ECE,
    EarlyLearningFrameworkCertification: req.body.ELF,
    AboriginalProgram: req.body.Aboriginal,
    ChildcareReduction: req.body.ChildCareFeedReduction,
    SpecialNeeds: req.body.specialNeeds,
    registrationDate: (registrationDate = newDate),
    Language: req.body.Languages,
    Services: [
      ["2020-1-1", "2020-1-1", 1],
      ["2020-1-1", "2020-1-1", 1],
    ],
    Opening_Hours: req.body.HouseOfOperation,
    Meals: [],
    Programs: req.body.programs,
    StreetAddress: "17 Winchester Ave",
    active: 1,
    Meals: [3, 5, 9, 10, 15, 18, 19],
    SiblingDiscount: req.body.MoreChanceWithSiblings,
    special_requirements: req.body.specialRequirements,
    Programs: req.body.programs,
    active: 1,
    specialPrograms: req.body.programList,
  };

  //filtering the data to match the database/table
  //requirements. (table uses int values for yes and no)
  if (req.body.faciltyType == "Licensed Family") {
    nursery_data["LicensedFamily"] = 1;
  } else {
    nursery_data["LicensedFamily"] = 0;
  }
  if (req.body.faciltyType == "Licensed Group") {
    nursery_data["LicensedGroup"] = 1;
  } else {
    nursery_data["LicensedGroup"] = 0;
  }

  if (nursery_data.EarlyChildhoodEdcuationCertification == "yes") {
    nursery_data.EarlyChildhoodEducationCertification = 1;
  } else {
    nursery_data.EarlyChildhoodEducationCertification = 0;
  }

  if (nursery_data.EarlyLearningFrameworkCertification == "yes") {
    nursery_data.EarlyLearningFrameworkCertification = 1;
  } else {
    nursery_data.EarlyLearningFrameworkCertification = 0;
  }

  if (nursery_data.AboriginalProgram == "yes") {
    nursery_data.AboriginalProgram = 1;
  } else {
    nursery_data.AboriginalProgram = 0;
  }

  if (nursery_data.ChildcareReduction == "yes") {
    nursery_data.ChildcareReduction = 1;
  } else {
    nursery_data.ChildcareReduction = 0;
  }

  if (nursery_data.SpecialNeeds == "yes") {
    nursery_data.SpecialNeeds = 1;
  } else {
    nursery_data.SpecialNeeds = 0;
  }

  if (nursery_data.SiblingDiscount == "yes") {
    nursery_data.SiblingDiscount = 1;
  } else {
    nursery_data.SiblingDiscount = 0;
  }

  const email = req.body.email;
  const password = req.body.password;

  //hashing the password receieved by the frontend
  bcrypt.hash(password, saltRounds, function (err, hash) {
    //updating the values in the dictionary
    nursery_data["NurseryPassword"] = hash;
    nursery_data["Email"] = email;
    //adding the nursery to the database
    db.add_nursery(nursery_data, function (err, results) {
      if (err) {
        console.log(err);
      }

      user_id = results.insertId;

      req.login(user_id, function (err) {
        res.redirect("/");
      });
    });
  });
});

module.exports = router;
