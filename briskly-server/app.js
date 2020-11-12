var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { check, validationResult } = require("express-validator");
var bcrypt = require("bcrypt");
// authentication packages
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MySQLStore = require("express-mysql-session")(session);
var cors = require("cors");
//business logic routes
var indexRouter = require("./routes/index");
var nurseryRouter = require("./routes/nurseryRoute");
var parentRouter = require("./routes/parentRoute");
var adminRouter = require("./routes/adminRoute");
var passwordRouter = require("./routes/passwordRoute");
var searchNurseryRouter = require("./routes/searchNurseryRoute");
var crudRouter = require("./routes/crudRoutes");
var db = require("./database_utils");
//express initizalisation
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// Require static assets from public folder
app.use(express.static(path.join(__dirname, "public")));
//local database variables, username, password etc, change this to env variables in prod
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "waitlist",
};

var sessionStore = new MySQLStore(options);
//change secret to env file in prod
//session and session store setup for passport.js to know if users are logged in/recognized
app.use(
  session({
    secret: "ajsndflaiwuenfl",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    //cookie: { secure: true },
  })
);
//passport.js initialize functions to setup sessions, boilerplate library code
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

//custom routes to provide an API for the react front end
app.use("/", indexRouter);
app.use("/", nurseryRouter);
app.use("/", parentRouter);
app.use("/", adminRouter);
app.use("/", passwordRouter);
app.use("/", searchNurseryRouter);
app.use("/", crudRouter);

//passport function that runs when you log in
//passport looks for fields "email" and "password" in the frontend form and uses that data to log in
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      //to add data from database to user session you have to give here
      //use the email the user gave and look them up in the database
      db.get_password({ email: username }, function (err, results) {
        if (err) {
          console.log(err);
        }
        //if there was no user found by the database query return false
        if (results.length === 0) {
          done(null, false);
        } else {
          //if there was a user with that username compare the database hashed password with the one the user gave
          const hash = results[0].password.toString();
          //bcrypt compares the password the user gave with one from the database
          bcrypt.compare(password, hash, function (err, response) {
            if (response === true) {
              return done(null, {
                //data assigned to user session, id and role
                user_id: results[0].userId,
                role: results[0].role,
              });
            } else {
              return done(null, false);
            }
          });
        }
      });
    }
  )
);
//serializing user data
passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});
//deserializing user data into a session
passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(res.locals.message);
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
