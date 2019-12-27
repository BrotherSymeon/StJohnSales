const mysql = require('mysql');

module.exports = (dbMultiConfig) => {
  var connection = mysql.createConnection(dbMultiConfig);

  var model = {};

  model.format = (query, values) => {
    return mysql.format(query, values);
  };

  model.query = (stmt, done) => {
    return new Promise((resolve, reject) => {
      connection.query(stmt, (err, result, fields) => {
        if(done) {
          return done(err, result, fields);
        }
        if(err) {
          return reject(err);
        }
        resolve(result, fields);
      });
    });
  };
  model.queryOptions = (query, values, callback) => {
    return new Promise(function(resolve, reject){
      connection.query(query, values, function(err, result, fields) {
        if(callback){
          return callback(err, result, fields);
        }
        if( err ) {
          return reject(err);
        }
        resolve(result, fields);
      });
    });

  };


  return model;

};
