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


  return model;

};
