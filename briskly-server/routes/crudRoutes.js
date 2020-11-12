var express = require("express");
var router = express.Router();
var db = require("../database_utils");

//GETTING PARENT DETAILS
router.get("/parent/:id", (req, res) => {
  //gets id from url and searches the database for the unique parent id and returns the parents info
  data = {
    userId: req.params.id,
  };
  db.get_parent(data, function (err, results) {
    if (err) {
      console.log(err);
      return { message: "failure" };
    }
    //results are sent to the frontend
    res.send(results);
  });
});

//GET NURSERY DETAILS
router.get("/nursery/:name", (req, res) => {
  //gets name from url and searches the database for the unique nursery name and returns the nursery info
  data = {
    name: req.params.name,
  };

  db.find_specific_nursery(data, function (err, results) {
    if (err) {
      console.log(err);
      return { message: "failure" };
    }
    //results are sent to the frontend
    res.send(results);
  });
});

module.exports = router;
