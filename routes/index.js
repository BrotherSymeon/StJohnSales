var express = require("express");
var fortune = require("../lib/fortune");
var gcp = require("../gcpDb");
//var debug = require('debug')('meadowlark:server');

var router = express.Router();

var sessionChecker = (req, res, next) => {
  console.log("sessionChecker");
  console.log(req.session);
  if (!req.session.user) {
    res.redirect("/users/login");
    //console.log('one')
  } else if (req.session.user.user_id && req.cookies.user_sid) {
    //console.log('2')
    next();
  } else {
    //console.log('3')
    res.redirect("/users/login");
  }
};

/* GET home page. */
router.get("/", sessionChecker, function(req, res, next) {
  try {
    res.render("index", { title: "St John Sales" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.get("/about", sessionChecker, function(req, res, next) {
  //eq.cookies.user_sid && !req.session.user)
  var randomFortune = fortune.getFortune();
  res.render("about", {
    fortune: randomFortune,
    title: "Meadowlark Travel",
    pageTestScript: "/qa/tests-about.js"
  });
});

router.get("/test", sessionChecker, function(req, res) {
  var mysql = require("mysql");
  var pool = mysql.createPool({
    host: "35.196.170.106",
    user: "salesadmin",
    password: "johnnyappleseed3334",
    database: "sales"
  });

  pool.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0].solution);
  });
});

module.exports = router;
