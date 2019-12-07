var express = require('express');
var fortune = require('../lib/fortune');
var salesController = require('../controllers/salesController');
//var gcp = require("../gcpDb");
//var debug = require('debug')('meadowlark:server');

var router = express.Router();
var title = 'St Johns Sales';

/* var sessionChecker = (req, res, next) => {
  console.log("sessionChecker");
  console.log(process.env.LOCAL);
  //if (!!process.env.LOCAL === true) {
  //  res.locals.authenticated = true;
  //  req.session.user = require('../lib/fakeUser').user;
  //  next();
 // } else {
    
    console.log(req.session);
    if (!req.session.user) {

      res.redirect("/auth/login");
      //console.log('one')
    } else if (req.session.user.user_id && req.cookies.user_sid) {
      try {
        //console.log(JSON.parse(req.session.user.roles));
      } catch (err) {
        console.log(err)
      }

      next();
    } else {
      //console.log('3')
      res.redirect("/auth/login");
    }
    
 // }
}; */

/* GET home page. */
router.get('/',  salesController.dashboard);

router.get('/about', function (req, res) {
  //eq.cookies.user_sid && !req.session.user)
  var randomFortune = fortune.getFortune();
  res.render('about', {
    fortune: randomFortune,
    title: `${title} - About`,
    pageTestScript: "/qa/tests-about.js"
  });
});

router.get('/admin',  function (req, res) {
  res.render('admin', { title });

})

router.get('/test',  function (req, res) {
  return res.sendStatus(200);
  //var mysql = require("mysql");
  //var pool = mysql.createPool({
  //  host: "35.196.170.106",
  //  user: "salesadmin",
  //  password: "johnnyappleseed3334",
  //  database: "sales"
  //});
  //
  //pool.query("SELECT * FROM tempOrders;", function(error, results, fields) {
  // if (error) throw error;
  // console.log("The solution is: ", results[0]);
  // 
  //});

});

module.exports = router;
