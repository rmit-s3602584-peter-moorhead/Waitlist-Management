var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var passport = require("passport");

var bcrypt = require("bcrypt");
const saltRounds = 10;
var db = require("../database_utils");

const authenticationMiddleware = require("./authMiddleware")
  .authenticationMiddleware;
const authorizationParentMiddleware = require("./authMiddleware")
  .authorizationParentMiddleware;

//method to get the children of the logged in parent and return them to the frontend
router.post(
  "/getChildren",
  authenticationMiddleware(),
  authorizationParentMiddleware(),
  function (req, res) {
    //storing the received data in a dictonary called parenIdData
    const parentIdData = { id: req.body.token.user_id };

    //first we get the parent id by passing the parentIdData
    db.get_parent_id(parentIdData, function (err, result) {
      //now we have the parentId

      //now we get all the children who's father/mother is 'parentId'. However,
      //if there is no data returned then the parent doesn't have a child
      //so it is a waste of time to do that so we just return an empty array.

      if (result.length > 0) {
        //we store the required data
        const parentId = result[0]["parentId"];
        const dataToGetChildren = { parentId: parentId };

        //now we get the children associated with the parentId
        db.get_child(dataToGetChildren, function (err, result) {
          //now we have all the children who are registered by this parent
          if(result.length > 0){
          //store children in a dictionary and store their ids in an array
          var children = {};
          var childrenIds = [];
          var allChildren = result;

          //adding all the children ids to the array
          for (var i = 0; i < result.length; i++) {
            children[i] = result[i];
            childrenIds.push(result[i]["childID"]);
          }

          //now we query the 'apply' table to get the children's status
          data = {
            ids: childrenIds,
          };
          db.get_children_for_my_children_page(data, function (err, result) {
            //now we filter the data so that the frontend received a
            //ready to use data
            var toReturn = [];
            var allNurseryNumbers = [];

            //trying to find if there is a child that actually
            //did apply for a nursery.
            //if the child did then we we store his/her nursery number
            //the nursery that they applied to in order for us later
            //to find its name
            for (var i = 0; i < allChildren.length; i++) {
              exists = false;
              nurseryNumber = -1;
              childStatus = -1;
              for (var y = 0; y < result.length; y++) {
                if (allChildren[i]["childID"] == result[y]["childID"]) {
                  exists = true;
                  nurseryNumber = result[y]["nurseryNumber"];
                  childStatus = result[y]["status"];
                  break;
                }
              }

              if (exists == false) {
                //in the case that the child is not
                //enrolled yet to a nursery

                //child name
                name =
                  allChildren[i]["FirstName"] + " " + allChildren[i]["Surname"];
                //pushing the data that will be shown to the user to the array
                toReturn.push(["None", name, "None", "None"]);
              } else {
                //now the child is actually enrolled to a nursery

                //child name
                name =
                  allChildren[i]["FirstName"] + " " + allChildren[i]["Surname"];
                //adding the details that will be used later
                toAdd = [nurseryNumber, name];

                //setting the correct status text
                if (childStatus == 0) {
                  toAdd.push("Waiting");
                } else if (childStatus == 1) {
                  toAdd.push("Enrolled/Accepted");
                } else {
                  toAdd.push("Declined");
                }
                //adding the data to the array that will be used next
                //to find out the nursery names
                toReturn.push(toAdd);
              }

              //reset the variables
              exists = false;
              nurseryNumber = -1;
              status = -1;
            }
            //get all the nursery numbers
            for (var i = 0; i < toReturn.length; i++) {
              if (toReturn[i][0] != "None") {
                allNurseryNumbers.push(toReturn[i][0]);
              }
            }

            //storing the results of the nursery name and number from the
            //sql queries
            namesAndNumbers = [];
            if (allNurseryNumbers.length > 0) {
              //now we get the nursery names
              db.get_all_nursery_names(
                { numbers: allNurseryNumbers },
                function (err, result) {
                  //now we have all the names
                  namesAndNumbers = result;

                  //now the final filter:

                  //the array that contains the data that will
                  //be sent to the frontend
                  sendToFrontEnd = [];
                  for (var i = 0; i < toReturn.length; i++) {
                    found = false;
                    nurseryName = "";
                    for (var y = 0; y < namesAndNumbers.length; y++) {
                      if (
                        toReturn[i][0] == namesAndNumbers[y]["nurseryNumber"]
                      ) {
                        //found a match.
                        //now we store the nursery name in order to put it in the array
                        //to be returned to the frontend
                        found = true;
                        nurseryName = namesAndNumbers[y]["NurseryName"];
                        break;
                      }
                    }

                    if (found == false) {
                      //no modifications needed
                      //just get the name and add None
                      name = toReturn[i][1];
                      sendToFrontEnd.push([0, name, "None", "None"]);
                    } else {
                      //get the name and status and nursery name
                      // and add to the array that will be returned to the
                      //frontend
                      name = toReturn[i][1];
                      status = toReturn[i][2];
                      sendToFrontEnd.push([0, name, nurseryName, status]);
                    }
                    //reset in case of possible duplicated
                    found = false;
                    nurseryName = "";
                  }

                  //send the data to the frontend (this case is when there
                  //are children in a nursery)
                  res.send({
                    message: "success",
                    data: sendToFrontEnd,
                  });
                }
              );
            } else {
              //sending the data to the frontend in the case that the children
              //are not enrolled to a nursery
              res.send({
                message: "success",
                data: toReturn,
              });
            }
          });
        }else{
          res.send({
            message: "success",
            data: [],
          });
        }
        });
      } else {
        //sending the data when there are NO children associated
        //with the parent
        res.send({
          message: "success",
          data: [],
        });
      }
    });
  }
);

//method to register a new parent, takes input from frontend and sends it to the sql query
router.post("/parentRegister", function (req, res, next) {
  // storing the required data received from the frontend
  //to register a parent to the system

  parent_data = {
    FirstName: req.body.firstName1,
    Surname: req.body.lastName1,
    PreferredName: req.body.userName1,
    DoB: req.body.birthday1,
    PhoneNumber: req.body.phoneNumber1,
    AlternatePhone: req.body.altNumber,
    password: req.body.password,
    Email: req.body.personalEmail1,
    LastLogin: "2020-8-30",
    active: "1",
    role: "parent",
    StreetAddress: req.body.homeAddress1,
    City: req.body.city1,
    State: req.body.state,
    State: req.body.state1,
    Gender: "M",
    registrationDate: "2020-8-30",
    Status: "1",
    Language: ["English"],
  };

  const password = parent_data.password;

  //hashing the password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    //adding the hashed password to the dictionary
    parent_data.password = hash;
    //adding the parent to the database
    db.add_parent(parent_data, function (err, results) {
      if (err) {
        console.log(err);
        return { message: "failure" };
      }

      user_id = results.insertId;
      //return a success message when it is done.
      return { message: "success" };
    });
  });
});

//ADD CHILD TO PARENT
router.post(
  "/addChildtoParent",
  authenticationMiddleware(),
  authorizationParentMiddleware(),
  (req, res, next) => {
    //here we add a child to the parent that wants to add that child
    //to their account

    //storing the data received from the frontend.
    data = {
      ParentID: req.body.user_id,
      FirstName: req.body.fName,
      Surname: req.body.sName,
      DoB: req.body.birthday1,
      Gender: req.body.gender,
      SpecialNeeds: req.body.specialNeedsHandling,
      HasSibling: 0,
      Language: [req.body.language],
    };

    //storing the parentId (userId)
    parentId = {
      id: req.body.user_id,
    };
    //passing the userId here to get the parentId from
    //the parent table
    db.get_parent_id(parentId, function (err, result) {
      //add the parent id
      data.ParentID = result[0]["parentId"];
      //add the child to the parent in the database
      db.add_child(data, function (err, results) {
        if (err) {
          console.log(err);
          //sending a failure because the child was not added
          res.send("failure");
        }
        console.log("Child added to parent");
        //sending a success because the child has been successfully added
        res.send({ message: "success" });
      });
    });
  }
);

router.post(
  "/getChildrenToApply",
  authenticationMiddleware(),
  authorizationParentMiddleware(),
  (req, res, next) => {
    //this is used to get all the children that are
    //able to be used to apply to a nursery

    const parentIdData = { id: req.body.token.user_id };
    //first we get the parent id
    db.get_parent_id(parentIdData, function (err, result) {
      //now we have the parentId
      const parentId = result[0]["parentId"];

      const dataToGetChildren = { parentId: parentId };
      //now we get all the children who's father/mother is 'parentId'
      db.get_child(dataToGetChildren, function (err, result) {
        //now we have all the children who are registered by this parent

        //store children in a dictionary and store their ids in an array
        var children = {};
        var childrenIds = [];
        var allChildren = result;

        for (var i = 0; i < result.length; i++) {
          children[i] = result[i];
          childrenIds.push(result[i]["childID"]);
        }

        //now we query the 'apply' table to get the children's status

        data = {
          ids: childrenIds,
        };

        db.get_children_for_my_children_page(data, function (err, result) {
          //now we have all the children

          //now we filter them.

          childrenToReturn = [];
          childrenFromApplyIds = []; //the children we need to remove
          childrenNotInApply = [];

          for (var i = 0; i < result.length; i++) {
            if (result[i]["status"] == 0 || result[i]["status"] == 1) {
              //child is declined by a nursery so the parent can
              //add the child to another nursery
              childrenFromApplyIds.push(result[i]["childID"]);
            }
          }

          //now we have the ids of the children to not send back to the frontend
          //so we start filtering them

          for (var i = 0; i < allChildren.length; i++) {
            var exists = false;

            for (var y = 0; y < childrenFromApplyIds.length; y++) {
              if (allChildren[i]["childID"] == childrenFromApplyIds[y]) {
                exists = true;

                break;
              }
            }

            if (exists == false) {
              childrenToReturn.push(allChildren[i]);
            }
            //reset exists
            exists = false;
          }

          //now send the data to the front end of all the children that can apply
          res.send({
            children: childrenToReturn,
          });
        });
      });
    });
  }
);

//as a parent choose one of your children and apply for them to a nursery
router.post(
  "/applyToNursery",
  authenticationMiddleware(),
  authorizationParentMiddleware(),
  (req, res, next) => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    //getting the date in the right format
    newdate = year + "-" + month + "-" + day;
    //storing the data receieved from the frontend
    data = {
      applicationDate: newdate,
      childId: req.body.child,
      id: req.body.token.user_id,
      nurseryNumber: req.body.nursery,
    };
    //apply the child to the nursery (will have a waiting status
    //which is defined in the apply_to_nursery method)
    db.apply_to_nursery(data, function (err, results) {
      if (err) {
        console.log(err);
        return { message: "failure" };
      }
      //sending a success message to the frontend when it works out!.
      res.send({ message: "success" });
      console.log("applied");

      return { message: "success" };
    });
  }
);

module.exports = router;
