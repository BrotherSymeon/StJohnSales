require('dotenv').config();
var mysql = require('mysql');
var config = require('./config');
var fs = require('fs');

var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
var files = stdinBuffer.toString();
let connection = mysql.createConnection(config.dev);


console.log('connecting to ', config.dev)

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
 
  connection.query(sql, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
    console.log(results)
    connection.end(function(err) {
      if (err) {
        return console.log(err.message);
      }
    });

  });
 
 
});




