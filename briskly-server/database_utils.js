//https://www.w3schools.com/nodejs/nodejs_mysql_create_db.asp
//https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files

var mysql = require("mysql");

//Creates the connection to the database. This is the local database
//Will need to move the information out of the file and have it loaded in so
//as to hide the password.
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Waitlist",
});

//Modules to be called externally
module.exports = {
  //Adds a new child to the database based on an existing parent.
  add_child: function add_child(data, callback) {
    results = [];

    sql =
      "INSERT INTO child (ParentId, FirstName, Surname, DoB, Gender, specialNeedsHandling, \
			hasSibling) VALUES ('" +
      data.ParentID +
      "','" +
      data.FirstName +
      "','" +
      data.Surname +
      "','" +
      data.DoB +
      "','" +
      data.Gender +
      "','" +
      data.SpecialNeeds +
      "','" +
      data.HasSibling +
      "')";

    con.query(sql, function (err, result) {
      if (err) throw err;

      results.push(result);

      //Inserts the languages the child speaks into the database
      var lang = [];
      sql = "INSERT INTO child_language (Language, childId) VALUES ?";
      for (var i = 0; i < data.Language.length; i++) {
        lang.push([data.Language[i], result.insertId]);
      }

      con.query(sql, [lang], function (err, result) {
        if (err) throw err;

        results.push(result);

        callback(null, results);
      });
    });
  },

  //Returns the parentId based on the userId passed through
  get_parent_id: function get_parent_id(data, callback) {
    console.log(data.id);

    sql = "select parentId from parent where userId = '" + data.id + "'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("HER");
      console.log(result);
      callback(null, result);
    });
  },

  //Add parent Module. As will all modules the information is passed through in JSON
  //Format and all elements should be available, even if empty
  add_parent: function add_parent(data, callback) {
    results = [];

    //Creates a new user and enters information int the user table
    sql =
      "INSERT INTO user (PhoneNumber, AlternatePhone,email, password, lastLogin, active, role,  StreetAddress," +
      " City, State) VALUES ('" +
      data.PhoneNumber +
      "','" +
      data.AlternatePhone +
      "','" +
      data.Email +
      "','" +
      data.password +
      "','" +
      data.LastLogin +
      "','" +
      data.active +
      "','parent','" +
      data.StreetAddress +
      "','" +
      data.City +
      "','" +
      data.State +
      "')";

    //executes the above query
    con.query(sql, function (err, result) {
      if (err) throw err;

      //prints out the result to the consol.
      console.log("1 row inserted " + result.insertId);
      results.push(result);

      //Creates an sql to insert further information into the parent table
      sql =
        "INSERT INTO parent (userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB)" +
        " VALUES ('" +
        result.insertId +
        "','" +
        data.Gender +
        "','" +
        data.registrationDate +
        "','" +
        data.Status +
        "','" +
        data.FirstName +
        "','" +
        data.Surname +
        "','" +
        data.PreferredName +
        "','" +
        data.DoB +
        "')";

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 row inserted " + result.insertId);
        results.push(result);

        //Creates SQL query for adding the parent's languages
        //Languages are passed through as a list
        var lang = [];
        sql = "INSERT INTO parent_language (Language, parentId) VALUES ?";
        for (var i = 0; i < data.Language.length; i++) {
          lang.push([data.Language[i], result.insertId]);
        }

        con.query(sql, [lang], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
          results.push(result);
          callback(null, results);
        });
      });
    });
  },

  //Adds an administrator to the database.
  add_admin: async function add_admin(data, callback) {
    sql =
      "INSERT INTO user (PhoneNumber, AlternatePhone,\
      email, password, lastLogin, active, role) VALUES ('" +
      data.PhoneNumber +
      "','" +
      data.AlternatePhone +
      "','" +
      data.email +
      "','" +
      data.password +
      "','" +
      data.lastLogin +
      "','" +
      data.active +
      "','admin')";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Updates the user fees with a new set of fees, and updates
  //The dates that the fees are applicable for.
  //May need to change these three queries to keep the old fees and have it
  //as adding new rows.
  updateUserFees: async function updateUserFees(data, callback) {
    console.log(data.user.activationDate);

    sql =
      "UPDATE fees SET validFrom = '" +
      data.user.activationDate +
      "'," +
      " validTo = '" +
      data.user.deactivationDate +
      "'," +
      " amount = '" +
      data.user.userFees +
      "'" +
      " WHERE feeType = '" +
      data.userType +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Updates the nursery fees
  updateNurseryFees: async function updateNurseryFees(data, callback) {
    console.log(data.user.activationDate);

    sql =
      "UPDATE fees SET validFrom = '" +
      data.user.activationDate +
      "'," +
      " validTo = '" +
      data.user.deactivationDate +
      "'," +
      " amount = '" +
      data.user.nurseryFees +
      "'" +
      " WHERE feeType = '" +
      data.userType +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Updates the additional fees with a new set of fees, and updates
  //The dates that the fees are applicable for.
  updateAddFees: async function updateAddFees(data, callback) {
    console.log(data.user.activationDate);

    sql =
      "UPDATE fees SET validFrom = '" +
      data.user.activationDate +
      "'," +
      " validTo = '" +
      data.user.deactivationDate +
      "'," +
      " amount = '" +
      data.user.addFees +
      "'" +
      " WHERE feeType = '" +
      data.userType +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Returns the details of an admin based on the userId sent through
  get_admin: async function get_admin(data, callback) {
    sql = "SELECT * FROM user WHERE userId = '" + data.userId + "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Returns all of the details of a prrent based on the userId sent through
  get_parent: async function get_parent(data, callback) {
    sql =
      "SELECT * FROM user LEFT JOIN parent ON user.userId = parent.userId WHERE user.userId = '" +
      data.userId +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Returns all of the childred connected to a specific parent
  get_child: async function get_child(data, callback) {
    sql = "SELECT * FROM child WHERE parentId = '" + data.parentId + "'";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  get_details_of_child: async function get_details_of_child(data, callback) {
    sql = "SELECT * FROM child WHERE childID IN (" + data + ")";

    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Update's the parent's last login details. This is updated on login
  //Other times this function is updates is to be determined
  update_login: async function update_login(data, callback) {
    sql =
      "UPDATE user SET lastLogin = '" +
      data.lastLogin +
      "' WHERE userId = '" +
      data.userId +
      "'";
    con.query(sql, function (err, result) {
      if (err) throw err;

      callback(null, result);
    });
  },

  //Returns the password based on the email sent through
  get_password: async function get_password(data, callback) {
    query_result = "";
    sql =
      "SELECT password, userId, role FROM user WHERE email = '" +
      data.email +
      "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      query_result = result;
      callback(null, query_result);
    });
  },

  //Returns a list of all the current fees.
  get_fees: async function get_fees(callback) {
    con.query("SELECT * FROM fees", function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  //Returns a list of emails based on the search criteria passed through
  //Either city, state or country. Will return either emails for parents or nurseries
  get_emails: async function get_emails(data, callback) {
    search = "";

    if (data.city != undefined) {
      search = "WHERE city= '" + data.city + "' AND state='" + data.state + "'";
    } else if (data.state != undefined) {
      search = "WHERE state = '" + data.state + "'";
    } else {
      if ((type = "parent")) {
        search =
          "LEFT JOIN city ON user.city = city.city AND user.state = city.state WHERE city.country = '" +
          data.country +
          "'";
      } else {
        search =
          "LEFT JOIN city ON user.city = city.city AND user.state = city.state WHERE city.country = '" +
          data.country +
          "'";
      }
    }

    sql =
      "SELECT email FROM user " + search + " AND role = '" + data.type + "'";

    if (
      data.country == undefined &&
      data.stata == undefined &&
      data.city == undefined
    ) {
      // in the case where the country, state and city are not defined.
      //then we get ALL the emails in the DB
      sql = "SELECT email FROM user where role = '" + data.type + "'";
    }

    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  //Returns the name of the nursary based in the userId passed through
  get_nursery_name: async function get_nursery_name(data, callback) {
    sql = "";
    if (data.id != undefined) {
      sql = "select NurseryName from nursery where userId = '" + data.id + "';";
    }
    if (data.nurseryNumber != undefined) {
      sql =
        "select NurseryName from nursery where nurseryNumber = '" +
        data.nurseryNumber +
        "';";
    }

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  get_all_nursery_names: async function get_all_nursery_names(data, callback) {
    if (data.numbers.length > 0) {
      sql = "select NurseryName, nurseryNumber from nursery where ";
    } else {
      sql = "";
    }

    continueSql = "";

    for (var i = 0; i < data.numbers.length; i++) {
      if (i == data.numbers.length - 1) {
        continueSql += "nurseryNumber = '" + data.numbers[i] + "';";
      } else {
        continueSql += "nurseryNumber = '" + data.numbers[i] + "' OR ";
      }
    }

    //appending all the statements together to make the BIG sql statement
    sql += continueSql;

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  //Returns the nursay email based on the userId passed through
  //This function is probably superflous, though will need to have
  //and additional part to the query to indicate that we are
  //Only looking for nurseries.
  get_nursery_email: async function get_nursery_name_and_email(data, callback) {
    sql = "select Email from user where userId = '" + data.id + "';";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  //Changes the password based on the userId.
  update_password: async function update_password(data, callback) {
    sql =
      "UPDATE user SET password ='" +
      data.password +
      "' WHERE userId ='" +
      data.userId +
      "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  //Add nursery function. Like above function, the data is passed through in JSON format
  add_nursery: async function add_nursery(data, callback) {
    //SQL for setting up initial entry in the nusery table
    //Adds the details to the user table
    results = [];

    sql =
      "INSERT INTO user (PhoneNumber, AlternatePhone,email, password, lastLogin, active, role,  StreetAddress, \
      		City, State) VALUES ('" +
      data.MainPhone +
      "','" +
      data.ContactPhone +
      "','" +
      data.Email +
      "','" +
      data.NurseryPassword +
      "','" +
      data.registrationDate +
      "','" +
      data.active +
      "','nursery','" +
      data.StreetAddress +
      "','" +
      data.City +
      "','" +
      data.State +
      "')";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 row inserted " + result.insertId);
      var nurseryNumber = result.insertId;
      results.push(result);

      //Adds the details to the nursery tables and generates a nurseryId
      sql =
        "INSERT INTO nursery(userId, NurseryName," +
        "SiblingDiscount, CommercialRegistrationNumber, EarlyChildhoodEducationCertification, " +
        "EarlyLearningFrameworkCertification, AboriginalProgram, ChildcareReduction, SpecialNeeds, registrationDate, special_requirements, " +
        "LicensedFamily, LicensedGroup, status) " +
        "VALUES ('" +
        nurseryNumber +
        "','" +
        data.NurseryName +
        "','" +
        data.SiblingDiscount +
        "','" +
        data.CommercialRegistrationNumber +
        "','" +
        data.EarlyChildhoodEducationCertification +
        "','" +
        data.EarlyLearningFrameworkCertification +
        "','" +
        data.AboriginalProgram +
        "','" +
        data.ChildcareReduction +
        "','" +
        data.SpecialNeeds +
        "','" +
        data.registrationDate +
        "','" +
        data.special_requirements +
        "','" +
        data.LicensedFamily +
        "','" +
        data.LicensedGroup +
        "','0')";

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Nursery instered " + result.insertId);
        var nurseryNumber = result.insertId;
        results.push(result);

        //Adds the languages of the nursery.
        //This is stored as a list, as are the rest
        var lang = [];
        sql = "INSERT INTO nursery_language (Language, nurseryNumber) VALUES ?";
        for (var i = 0; i < data.Language.length; i++) {
          lang.push([data.Language[i], nurseryNumber]);
        }

        console.log("LABGUAGES::::");
        console.log(data.Language);

        con.query(sql, [lang], function (err, result) {
          console.log(
            "Number of records inserted FOR LANGUAGE: " + result.affectedRows
          );
          //Adds the hours that the nursery is opne
          var hours = [];
          sql =
            "INSERT INTO nursery_hours (opening_hours, nurseryNumber) VALUES ?";
          for (var i = 0; i < data.Opening_Hours.length; i++) {
            hours.push([data.Opening_Hours[i], nurseryNumber]);
          }

          con.query(sql, [hours], function (err, result) {
            console.log("INSETED IN HOURS");

            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            console.log("PROGRAMS::::");
            console.log(data.Programs);
            results.push(result);

            //Adds the programs that the nursery offers.
            var program = [];
            sql =
              "INSERT INTO nursery_programs (program, nurseryNumber) VALUES ?";
            for (var i = 0; i < data.Programs.length; i++) {
              program.push([data.Programs[i], nurseryNumber]);
            }

            con.query(sql, [program], function (err, result) {
              if (err) throw err;
              results.push(result);
              console.log("Number of records inserted: " + result.affectedRows);

              callback(null, results);
            });
          });
        });
      });
    });
    return Promise.resolve(true);
  },

  //Returns the details of the nursery based on the nursery name
  find_specific_nursery: function find_specific_nursery(data, callback) {
    //need to change so it only grabs non-security risk data
    sql = "SELECT * FROM nursery WHERE NurseryName = '" + data.name + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;

      return callback(null, result);
    });
  },

  //Returns all of the details of a specific nursery
  get_nursery: function get_nursery(data, callback) {
    //Gets all of the information from the user and the nursery tables
    sql =
      "SELECT * FROM user LEFT JOIN nursery ON user.userId = nursery.userId WHERE nursery.nurseryNumber = '" +
      data.number +
      "'";

    nursery = [];

    con.query(sql, function (err, result) {
      if (err) throw err;

      city = result[0].City;
      state = result[0].State;

      nursery.push(result);

      //Gets all of the information regarding the services the nursery offers
      sql =
        "SELECT * FROM services LEFT JOIN nursery_services ON nursery_services.serviceId = services.serviceId WHERE nursery_services.nurseryNumber = '" +
        data.number +
        "'";
      con.query(sql, function (err, result) {
        result.push({ Name: "Nursery Services" });
        nursery.push(result);

        //Returns the hours that the nursery operates
        sql =
          "SELECT * FROM nursery_hours WHERE nurseryNumber = '" +
          data.number +
          "'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          result.push({ Name: "Nursery Hours" });
          nursery.push(result);
        });

        //returns all of the languages that the nursery offers
        sql =
          "SELECT * FROM nursery_language WHERE nurseryNumber = '" +
          data.number +
          "'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          result.push({ Name: "Nursery Languages" });
          nursery.push(result);

          //Returns the details of the meals that the nursery offers.
          //This probably is better to be included in the services table
          sql =
            "SELECT * FROM nursery_meals LEFT JOIN meals ON nursery_meals.mealId = meals.mealId WHERE nursery_meals.nurseryNumber = '" +
            data.number +
            "'";

          con.query(sql, function (err, result) {
            if (err) throw err;
            result.push({ Name: "Nursery meals" });
            nursery.push(result);

            //Returns the programs the nursery offers. It might be best to
            //also include this in the services table
            sql =
              "SELECT * FROM nursery_programs WHERE nurseryNumber = '" +
              data.number +
              "'";
            con.query(sql, function (err, result) {
              if (err) throw err;
              result.push({ Name: "Nursery Programs" });
              nursery.push(result);

              //returns all of the special programs the nursery offers.
              //This probably also needs to be included in the services table
              sql =
                "SELECT * FROM nursery_special_programs WHERE nurseryNumber = '" +
                data.number +
                "'";
              con.query(sql, function (err, result) {
                if (err) throw err;
                result.push({ Name: "Special Programs" });
                nursery.push(result);

                //returns the country in which the nursery is located based on
                //the city and the state. Might want to include post code/zip code
                //here as well.
                sql =
                  "SELECT country FROM city WHERE City = '" +
                  city +
                  "' AND State = '" +
                  state +
                  "'";

                con.query(sql, function (err, result) {
                  if (err) throw err;
                  result.push({ Name: "Country" });

                  nursery.push(result[0]);
                  callback(null, nursery);
                });
              });
            });
          });
        });
      });
    });
  },

  get_user_email: async function get_user_email(data, callback) {
    //return the email associated with the provided user_id
    //This probably can be used for the get nursery email
    sql = "select Email from user where userId = '" + data.id + "';";

    con.query(sql, function (err, result) {
      if (err) throw err;
      query_result = result;
      callback(null, query_result);
    });
  },

  //This returns a list of nurseries as specified by the user
  search_nursery_user: async function search_nursery_user(data, callback) {
    sql =
      "SELECT nursery.nurseryName, nursery.nurseryNumber, nursery.CommercialRegistrationNumber, user.city, \
      user.state, nursery.status FROM user LEFT JOIN nursery ON user.userId = nursery.userId ";

    search = "WHERE ";

    if (data.city != undefined) {
      search = " AND ";
      sql =
        sql +
        "WHERE user.city = '" +
        data.city +
        "' AND user.state = '" +
        data.state +
        "'";
    } else if (data.state != undefined) {
      search = " AND ";
      sql = sql + "WHERE user.state = '" + data.state + "'";
    } else if (data.country != undefined) {
      search = " AND ";
      sql =
        sql +
        "LEFT JOIN city ON user.city = city.city AND user.state = city.state WHERE city.country = '" +
        data.country +
        "'";
    }

    if (data.ChildcareReduction != undefined) {
      search = " AND ";
      sql =
        sql +
        search +
        "nursery.ChildcareReduction = '" +
        data.ChildcareReduction +
        "'";
    }

    if (data.EarlyChildhoodEducationCertification != undefined) {
      search = " AND ";
      sql =
        sql +
        search +
        "nursery.EarlyChildhoodEducationCertification = '" +
        data.EarlyChildhoodEducationCertification +
        "'";
    }

    if (data.EarlyLearningFrameworkCertification != undefined) {
      search = " AND ";
      sql =
        sql +
        search +
        "nursery.EarlyLearningFrameworkCertification = '" +
        data.EarlyLearningFrameworkCertification +
        "'";
    }

    if (data.SpecialNeeds != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.SpecialNeeds = '" + data.SpecialNeeds + "'";
    }

    if (data.SpecialNeeds != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.SpecialNeeds = '1'";
    }

    if (data.SiblingDiscount != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.SiblingDiscount = '1'";
    }

    if (data.LicensedFamily != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.LicensedFamily = '1'";
    }

    if (data.LicensedGroup != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.LicensedGroup = '1'";
    }
    if (data.status != undefined) {
      search = " AND ";
      sql = sql + search + "nursery.status = '" + data.status + "'";
    }

    sql = sql + search + "nursery.status <> '3'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },
  change_nursery_status: async function change_nursery_status(data, callback) {
    //this function updates the nursery status in the DB
    //approved, declined...etc

    sql =
      "update nursery set status='" +
      data.status +
      "' where nurseryNumber ='" +
      data.nurseryNumber +
      "';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  search_nursery: async function search_nursery(data, callback) {
    sql =
      "SELECT nursery.nurseryName, nursery.nurseryNumber, nursery.CommercialRegistrationNumber, user.city, \
  		user.state, nursery.status FROM user LEFT JOIN nursery ON user.userId = nursery.userId ";

    search = "WHERE ";

    if (data.name != undefined) {
      search = " AND ";
      sql = sql + "WHERE nursery.NurseryName = '" + data.name + "'";
    } else if (data.CRN != undefined) {
      search = " AND ";
      sql =
        sql + "WHERE nursery.CommercialRegistrationNumber = '" + data.CRN + "'";
    } else {
      if (data.city != undefined) {
        search = " AND ";
        sql =
          sql +
          "WHERE user.city = '" +
          data.city +
          "' AND user.state = '" +
          data.state +
          "'";
      } else if (data.state != undefined) {
        search = " AND ";
        sql = sql + "WHERE user.state = '" + data.state + "'";
      } else if (data.country != undefined) {
        search = " AND ";
        sql =
          sql +
          "LEFT JOIN city ON user.city = city.city AND user.state = city.state WHERE city.country = '" +
          data.country +
          "'";
      }

      if (data.registrationStatus != undefined) {
        search = " AND ";
        sql =
          sql + search + "nursery.status = '" + data.registrationStatus + "'";
      }

      if (data.lowerDate != undefined) {
        search = " AND ";
        sgl =
          sql +
          search +
          "registrationDate >= Convert(datetime, '" +
          data.lowerDate +
          "')";
      }

      if (data.upperDate != undefined) {
        search = " AND ";
        sgl =
          sql +
          search +
          "registrationDate <= Convert(datetime, '" +
          data.upperDate +
          "')";
      }
    }

    sql = sql + search + " role = 'nursery'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      
      callback(null, result);
    });
  },

  get_children_for_my_children_page: async function get_children_for_my_children_page(
    data,
    callback
  ) {
    //will receive child ids
    /*
      data {
        ids: [] => array of children ids
      }

      will loop through it and get all the children in the "apply" table to know their status for the parent
    */

    continueSqlStatement = "";

    const allIds = data.ids;

    for (var i = 0; i < allIds.length; i++) {
      if (i == allIds.length - 1) {
        //don't add space at the end. WILL BE THE END OF SQL STATEMENT
        continueSqlStatement += "childID = '" + allIds[i] + "';";
      } else {
        //add space
        continueSqlStatement += "childID = '" + allIds[i] + "' OR ";
      }
    }

    sql = "select * from apply where " + continueSqlStatement;

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  apply_to_nursery: async function apply_to_nursery(data, callback) {
    sql =
      "INSERT INTO apply (nurseryNumber, childId, applicationDate, status) VALUES ('" +
      data.nurseryNumber +
      "','" +
      data.childId +
      "','" +
      data.applicationDate +
      "','0')";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  get_All_Applied_ChildrenIds: async function get_All_Applied_ChildrenIds(
    data,
    callback
  ) {
    //all applied waiting children.

    sql =
      "select childID, appointmentDate from apply where nurseryNumber = '" +
      data.nurseryNumber +
      "' and " +
      "status = 0;";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },
  get_nurseryNumber: async function get_nurseryNumber(data, callback) {
    sql = "select nurseryNumber from nursery where userId = '" + data.id + "';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  get_child_basedOnChildId: async function get_child_basedOnChildId(
    data,
    callback
  ) {
    var sql =
      "select FirstName, Surname, hasSibling, specialNeedsHandling, childID from " +
      "child where ";

    console.log(data.childIds[0]);

    var continueSqlStatement = "";
    for (var i = 0; i < data.childIds.length; i++) {
      if (i == data.childIds.length - 1) {
        continueSqlStatement += "childID = '" + data.childIds[i] + "';";
      } else {
        continueSqlStatement += "childID = '" + data.childIds[i] + "' OR ";
      }
    }

    sql += continueSqlStatement;

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },
  schedule_meeting: async function schedule_meeting(data, callback) {
    sql =
      "update apply set appointmentDate = '" +
      data.date +
      "' " +
      "where childId = '" +
      data.childId +
      "' and nurseryNumber = '" +
      data.nurseryNumber +
      "';";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  get_parent_email: async function get_parent_email(data, callback) {
    sql = "select parentId from child where childID = '" + data.childId + "';";

    con.query(sql, function (err, result) {
      if (err) throw err;

      parentId = result[0]["parentId"];
      sql = "select userId from parent where parentId = '" + parentId + "';";

      con.query(sql, function (err, result) {
        if (err) throw err;

        userId = result[0]["userId"];

        sql = "select Email from user where userId = '" + userId + "';";
        con.query(sql, function (err, result) {
          if (err) throw err;
          callback(null, result);
        });
      });
    });
  },
  get_nursery_email: async function get_nursery_email(data, callback) {
    //first we get the userId from the nursery table
    //then we get the email from the user table based on the userId that we got
    //from the first query

    sql = "select userId from nursery where NurseryName='" + data.name + "';";
    con.query(sql, function (err, result) {
      if (err) throw err;

      userId = result[0]["userId"];

      sql = "select Email from user where userId='" + userId + "';";

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("here");
        console.log(result);
        callback(null, result);
      });
    });
  },

  get_applications: async function get_applications(data, callback) {
    sql =
      "SELECT * FROM apply WHERE nurseryNumber = '" +
      data.nurseryNumber +
      "' AND status = '" +
      data.status +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  respond_to_application: async function respond_to_application(
    data,
    callback
  ) {
    sql =
      "UPDATE apply SET status = '" +
      data.status +
      "' WHERE nurseryNumber = '" +
      data.nurseryNumber +
      "' AND childId ='" +
      data.childId +
      "'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },

  close_db: async function close_db() {
    con.end((err) => {});
  },

  wait: async function wait() {
    await new Thenable(1);
    return Promise.resolve(true);
  },

  test_db: async function test() {
    con.query("SELECT * FROM language", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      //con.end()
    });
    return Promise.resolve(true);
  },
};

con.connect((err) => {
  if (err) throw err;
  console.log("connected");
});
