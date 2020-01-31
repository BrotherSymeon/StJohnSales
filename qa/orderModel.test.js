
var mysql = require('mysql');
var dbConfig = require('../config/db');
dbConfig.connectionLimit = 5;

var pool = {};
pool.getConnection = function getConnection(callback) {
  var connection = {};
  connection.release = function () {};
  connection.query = function (q, cb) {
    var error = null;
    var result = [{
      'COUNT(*)': 1
    }];
    var fields = {};
    cb(error, result, fields);
  };
  var err = null;
  callback(err, connection);
};
mysql.createPool = function () {
  return pool;
};

var Connection = require('../lib/mysql-model2')(dbConfig);
var Order = require('../models/Orders')(Connection);


describe('Order Model', function () {
  describe('#count', function () {
    it('should retrn the count', function (done) {

      var orders = new Order();
      var count = orders.find('count', {}).then(val => {
        expect(val).toBe(1);
        done();
      });
    });
  });
});
