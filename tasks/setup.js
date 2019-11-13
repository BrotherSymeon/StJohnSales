var db = require('../db');

var users = {
  tables: {
    Users: [
      {
        username: "Brother Symeon",
        email: "brother.symeon@gmail.com",
        description: "dummy"
      }
    ]
  }
};

exports.load = function() {
  db.connect(db.MODE_PROD, function() {
    db.drop(['Users'], function(err){
      if (err) return console.log(err);
      console.log("Data has been deleted...");
    })
    db.fixtures(users, function(err) {
      if (err) return console.log(err);
      console.log("Data has been loaded...");
    });
  });
};
