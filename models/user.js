var db = require('../db');

exports.create = function(username, email, description, done){
  var values = [username, email, description];
  
  db.get().query('INSERT INTO Users (username, email, description) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return done(err);
    done(null, result.insertId);
  });
  
};

exports.getAll = function(done) {
  db.get().query('SELECT * FROM Users;', function ( err, rows) {
    if (err) return done(err);
    done( null, rows);
  });
};

exports.getByEmail = function ( email, done ) {
  db.get().query('SELECT * FROM Users WHERE email = ;', function ( err, rows) {
    if (err) return done(err);
    done( null, rows);
  });
}