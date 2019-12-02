const mysql = require('mysql');


module.exports = class DbModel {
  constructor(options){
    this.connection = mysql.createConnection(options);
  }
  setSql(sql) {
    for (var key in sql) {
      if (typeof(sql[key]) != "function") {
        this.set(key, sql[key]);
      }
    }
  }
  query(query, callback) {
    this.connection.query(query, function(err, result, fields) {
      if(callback){
        callback(err, result, fields);
      }
    });	
  }
}