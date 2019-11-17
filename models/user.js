var db = require("../db");

exports.create = function(username, email, description, done) {
  var values = [username, email, description];

  db.get().query(
    "INSERT INTO Users (username, email, description) VALUES(?, ?, ?)",
    values,
    function(err, result) {
      if (err) return done(err);
      done(null, result.insertId);
    }
  );
};

exports.getAll = function(done) {
  db.get().query('SELECT * FROM Users;', function(err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};

exports.create = function({ username, email, description, roles }, done) {
  let stmt = `INSERT INTO Users(username, email, description)
                VALUES(?,?,?,?)`;
  
  let user = [username, email, description];
  user.push(JSON.stringify(roles));
  db.get().query(stmt, user, function(err, results, fields) {
    if (err) {
      return console.error(err.message);
    }
    // get inserted id
    console.log('User user_id:' + results.insertId);
  });
};

exports.findById = function(id, done) {
  db.get().query('SELECT * FROM Users WHERE user_id = ?;', id, function(
    err,
    rows
  ) {
    if (err) return done(err);
    var user = JSON.parse(JSON.stringify(rows[0]));
    done(null, user);
  });
};

exports.findByEmail = function(email, done) {
  db.get().query('SELECT * FROM Users WHERE email = ?;', email, function(
    err,
    rows
  ) {
    if (err) return done(err);
    console.log(err);
    //if (rows.length === 0) return done(new Error('no data'))
    console.log(rows);
    done(null, rows);
  });
};
