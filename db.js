var mysql = require('mysql');
var PROD_DB ='app_prod_db'
  , TEST_DB = 'app_test_db';

exports.MODE_TEST = 'mode_test';
exports.MODE_PROD = 'mode_prod';

var state = {
  pool: null,
  mode: null
};

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PSWD,
    database : process.env.MYSQL_DB
  });
  
  state.mode = mode;
  done();
  
};

exports.get = function() {
  return state.pool;
};

exports.fixtures = function(data) {
  var pool = state.pool;
  if(!pool) return done(new Error('Missing database connection.'));
  
  var names = Object.keys(data.tables);
  
};