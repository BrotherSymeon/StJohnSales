var express = require('express');
var fortune = require('../lib/fortune');
//var debug = require('debug')('meadowlark:server');


var router = express.Router();

var sessionChecker = (req, res, next) => {
  console.log('sessionChecker')
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect('/users/login');
    }    
};


/* GET home page. */
router.get('/', sessionChecker, function (req, res, next) {
  try {
    res.render('index', { title: 'St John Sales' });
  } catch (err) {
    console.log(err);
    next(err);
  }

});
router.get('/about', function (req, res, next) {
  console.log('/about');
  console.log(req.session);
  res.locals.authenticated = true
  
  //eq.cookies.user_sid && !req.session.user) 
  var randomFortune = fortune.getFortune();
  res.render('about', {
    fortune: randomFortune,
    title: 'Meadowlark Travel',
    pageTestScript: '/qa/tests-about.js'
  });
});

router.get('/headers', function (req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
  res.send(s);
});
router.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river', { title: 'Meadowlark Travel' });
});
router.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate', { title: 'Meadowlark Travel' });
});

module.exports = router;
