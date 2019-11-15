var express = require("express");
var fortune = require("../lib/fortune");
//var debug = require('debug')('meadowlark:server');

var router = express.Router();

var sessionChecker = (req, res, next) => {
  console.log("sessionChecker");
  //console.log(req.session.user.id);
  if (req.session.user && req.cookies.user_sid) {
    console.log('one')
    next();
  } else if (!req.session.user) {
    console.log('2')
    res.redirect("/users/login");
  } else {
    console.log('3')
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

module.exports = router;
