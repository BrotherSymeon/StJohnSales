var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');




module.exports = (db) => {
  const authController = {};
  authController.getLogin = (req, res) => {
    //render login form
    res.render('auth/login', { title: 'St Johns Sales - Login' });
  };

  authController.passportLoginMiddleware = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  });

  authController.login = async (req, res, next) => {
    res.redirect('/');
    //res.render('auth/login', { 'message': req.flash('message') });
  };

  authController.logout = async (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
      res.redirect("/");
    } else {
      res.redirect("/auth/login");
    }
  }


  authController.getRegister = async (req, res) => {
    //render sign up form
    res.render('auth/register', { 'message': req.flash('message') });
  };

  authController.register = async (req, res) => {
    try {
      var body = req.body;
      if (body && body.email && body.password) {
        
        var users = new db.Users();
        var sql = 'SELECT * FROM Users WHERE email = ?;';
        var user = await users.queryOptions(sql, [body.email]);
        console.log(user);

        if (user.length) {
          req.flash('message', 'User already exists!')
          return res.render('auth/register', { 'message': req.flash('message') });
        } else {
          //hash password and store user to db
          var hash = await bcrypt.hash(body.password, 10);

          console.log(`Hash: ${hash}`);
        

          try {
            var data = [body.username, body.email, hash, body.email];
            var insertStmt = `INSERT INTO Users(username, email, password)
            SELECT ?, ?, ? FROM DUAL
            WHERE EXISTS (SELECT 1 FROM CanRegister WHERE email=?); `;
            var result = await users.queryOptions(insertStmt, data);
            if (result.affectedRows === 0) {
              req.flash('message', 'You are not allowed to register for acces to this app. Please see your systems admin');
              
              return res.render('auth/register', {message: req.flash('message')});
            }
          } catch (err) {
            console.log(err);
            return res.render('auth/register', { 'message': req.flash('message', 'Error creating user. Please see your systems admin') });

          }


          console.log(result);
          return res.render('auth/login', { 'message': req.flash('message', 'Please login with your new account') });
        }

      } else {
        req.flash('message', 'username and password required');
        return res.render('auth/register', { 'message': req.flash('message', 'there was an essue') });
      }

    } catch (err) {
      console.log(err);
      return res.render('auth/register', { 'message': req.flash('message', 'OOps.. something has gone wrong') });
    }


  };

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    if (!email || !password) {
      return done(null, null, { message: 'All fields are required.' });
    }

    try {
      var users = new db.Users();
      var usersFound = await users.find('first', { where: `email = '${email}'` });
      
      if (!usersFound.length) {
        return done(null, null, { message: 'User Not Found.' });
      }
      var isCorrect = await bcrypt.compare(password, usersFound[0].password);
      if (!isCorrect) {
        return done(null, null, { message: 'Invalid username or password.' });
      }
      //maybe this should be req.passport.session.user
      req.session.user = usersFound[0];
      return done(null, usersFound[0]);

    } catch (err) {
      console.log(err)
      return done(null, false, err.message);
    }


  }));

  passport.serializeUser(async function (user, done) {
    done(null, user.user_id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      var users = new db.Users();
      var user = await users.find('first', { where: `user_id = ${id}` });
      return done(null, user);
    } catch (err) {
      console.log(`passport deserialize error: ${err.message}`);
      return done(null, null, { message: err.message });
    }

  });


  return authController;

};