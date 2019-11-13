var express = require('express');
var mysql = require('mysql')
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/users/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //  return cb(err, user);
    //});
    return cb(null, {
                profile: profile,
                token: token
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
  console.log(user);
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  console.log(obj);
  cb(null, obj);
});


/* GET users listing. */
router.get('/auth/google',
  passport.authenticate('google', { scope:   ['https://www.googleapis.com/auth/userinfo.profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/login', function(req, res) {
  res.locals.authenticated = false;
  res.render('login');
});

router.get('/login/google',
  passport.authenticate('google', { scope:   ['https://www.googleapis.com/auth/userinfo.profile'] }));

router.post('/login', function(req, res) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.password);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/');
});


module.exports = router;
