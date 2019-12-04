var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  if(!username || !password ) { 
    return done(null, null, {message: 'All fields are required.'}); 
  }
  var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
  try{
    var users = new db.Users();
    var usersFound = await users.find('all', {where: `username = ${username}`});
    if (!usersFound.length){
      return done(null, null, {message: 'User Not Found.'});
    }
    salt = salt+''+password;
    var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
    var dbPassword  = usersFound[0].password;
    if(!(dbPassword === encPassword)){
      return done(null, null, {message: 'Invalid username or password.'});
    }
    req.session.user = usersFound[0];
    return done(null, usersFound[0]);

  }catch(err) {
    console.log(err)
    return done(null, false, err.message);
  }
  

}));


module.exports = (db) => {
  const authController = {};
  authController.getLogin = async (req, res) => {
    //render login form
  }

  authController.login = async (req, res) => {

  }

  authController.getSignup = async (req, res) => {
    //render sign up form
  }

  authController.signup = async (req, res) => {

  }

}