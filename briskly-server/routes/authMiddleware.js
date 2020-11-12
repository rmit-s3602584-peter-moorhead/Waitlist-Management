ROLE = {
  nursery: "nursery",
  parent: "parent",
  admin: "admin",
};
//Authenticate method to check if the user is logged in, checks to see if a token exists and it contains a user id and a user role
module.exports.authenticationMiddleware = (req, res, next) => {
  return (req, res, next) => {
    console.log(
      `Authentication => req.session.passport.user: ${JSON.stringify(
        req.body.token
      )}`
    );

    if (
      req.body.token != {} &&
      req.body.token["user_id"] != "" &&
      req.body.token["role"] != ""
    ) {
      console.log("user authenticated");
      return next();
    }
    console.log("not authenticated");

    res.redirect("/login");
  };
};
//Authorisation method to check if the user logged in has the role of parent, checks the token parsed in that it has a role of parent
module.exports.authorizationParentMiddleware = (req, res, next) => {
  return (req, res, next) => {
    console.log(
      `Authrization => req.session.passport.user: ${JSON.stringify(
        req.body.token
      )}`
    );
    if (req.body.token.role == ROLE.admin) return next();
    console.log("not admin");
    if (req.body.token.role == ROLE.parent) return next();
    console.log("not parent");

    console.log("Not Authorized: Not a parent");
    console.log("Role: " + req.body.token.role);
    res.redirect("/profile");
  };
};
//Authorisation method to check if the user logged in has the role of nursery, checks the token parsed in that it has a role of nursery
module.exports.authorizationNurseryMiddleware = (req, res, next) => {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.body.token)}`);

    console.log("Role: " + req.body.token.role);
    if (req.body.token.role == ROLE.admin) return next();
    if (req.body.token.role == ROLE.nursery) return next();

    console.log("Not Authorized: Not a nursery");
    console.log("Role: " + req.token.user.role);
    res.redirect("/profile");
  };
};
//Authorisation method to check if the user logged in has the role of admin, checks the token parsed in that it has a role of admin
module.exports.authorizationAdminMiddleware = (req, res, next) => {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.body.token)}`);

    if (req.body.token["role"] == ROLE.admin) return next();

    console.log("Not Authorized: Not an admin");
    console.log("Role: " + req.body.token["role"]);
    res.redirect("/profile");
  };
};
