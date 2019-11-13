var express = require('express');
var User = require('../models/user');
var mysql = require('mysql');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://stjohnsales.glitch.me/users/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findByEmail(profile.emails[0].value, function (err, data) {
      console.log('user:');
      var user = JSON.parse(JSON.stringify(data[0]))
      console.log(user);
    });
    return cb(null, {
                profile: '',
                token: ''
            });
  }
));


var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PSWD,
  database : process.env.MYSQL_DB
});


passport.serializeUser(function(user, cb) {
  console.log(`serializing:`);
  console.log(user);
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  console.log(`deserializing:`);
  console.log(obj);
  cb(null, obj);
});

//'https://www.googleapis.com/auth/userinfo.email', 
//https://www.googleapis.com/auth/userinfo.email
/* GET users listing. */
router.get('/auth/google',
  passport.authenticate('google', { scope:   ['openid', 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/plus.me'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://stjohnsales.glitch.me/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('redirecting');
    res.redirect('/');
  });

router.get('/login', function(req, res) {
  res.locals.authenticated = false;
  res.render('login');
});

router.get('/login/google',
  passport.authenticate('google', { scope:   ['openid', 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'] }));

router.post('/login', function(req, res) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.password);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/');
});


module.exports = router;
