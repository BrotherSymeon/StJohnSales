var db = require('../db');

var users = {
  tables: {
    Users: [
      { username: 'symeon',
        email: 'brother.symeon@gmail.com',
       description: 'dummy'
      }
    ]
  }
};

exports.
db.connect(db.MODE_PROD, function() {
  db.fixtures(users, function(err) {
    if (err) return console.log(err);
    console.log('Data has been loaded...');
  });
});


