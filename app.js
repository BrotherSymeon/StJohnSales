var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-hbs');
var debug = require('debug')('meadowlark:server');
var passport = require('passport');
require('./config/containerConfig').config();

/* var { diContainer }  = require('./diContainer');
diContainer.factory('dbConfig', require('./config/db'));
diContainer.factory('salesDb', require("./gcpDb"));
diContainer.factory('utils', require('./lib/utilities'));
diContainer.factory('orderService', require('./helpers/orders'));
diContainer.factory('mySqlConnection', require('./lib/mysql-model2'));
//diContainer.factory('mySqlConnection', require('../db/connection'));

//MODELS ---->
diContainer.factory('processDetailsModel', require('./models/FileProcessDetails'));
diContainer.factory('processModel', require('./models/FileProcess'));
diContainer.factory('salesModel', require('./models/sales'));

//CONTROLLERS----->
diContainer.factory('adminController', require('./controllers/adminController'));
diContainer.factory('fileProcessController', require('./controllers/fileProcessController'));

global.goc = {};
goc.container = diContainer */;




var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbConfig = require('./config/db');
 
var options = {
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PSWD,
  database: process.env.MYSQL_DB
};

var test = dbConfig();
 
var sessionStore = new MySQLStore(options);
 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
   helpers: {
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

hbs.registerHelper('toJSON', function(object) {
  return JSON.stringify(object);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    key: 'user_sid',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && req.session.user) {
      res.locals.authenticated = true;
      res.locals.user = req.session.user;
    }
    next();
});


app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);


function getWeatherData() {
  return {
    locations: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)',
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)',
      },
    ],
  };
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('500');
});



module.exports = app;
