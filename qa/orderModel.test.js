
var mysql = require('mysql');
var dbConfig = require('../config/db');
dbConfig.connectionLimit = 5;

function setResponse(resp) {
  var connection = {};
  var self = this;
  var pool = {};
  pool.connection = connection;
  connection.release = function () {};
  connection.query = jest.fn((query, cb) => {
    cb(resp.error, resp.result, resp.fields);
  });
  pool.getConnection = function getConnection(callback) {
    //connection.query = function (q, cb) {
    //var error = resp.error;
    //var result = resp.result || [];
    //var result = [{
    //  'COUNT(*)': 1
    //}];
    //var fields = resp.fields || {};
    //cb(error, result, fields);
    //};
    var err = null;
    callback(err, connection);
  };
  mysql.createPool = function () {
    return pool;
  };
  return connection;
}



describe('Order Model', function () {
  it('should have a primaryKey', function () {

    var con = setResponse({
      result: [{
        'COUNT(*)': 1
      }]
    });

    var Connection = require('../lib/mysql-model2')(dbConfig);
    var Order = require('../models/Orders')(Connection);
    var orders = new Order({
      OrderId: 345,
      DayOfYear: 0
    });
    expect(orders.primaryKey).toBe('OrderId');
    expect(Object.keys(orders.attributes)).toContain('OrderId');
    console.log('mock %o', con.query.mock);
    console.log('Object keys %o', Object.keys(orders));
    console.log('attribute keys %o', Object.keys(orders.attributes));
  });
  it('should have a table name', function () {

    setResponse({
      result: [{
        'COUNT(*)': 1
      }]
    });

    var Connection = require('../lib/mysql-model2')(dbConfig);
    var Order = require('../models/Orders')(Connection);
    var orders = new Order({
      OrderId: 345
    });
    expect(orders.tableName).toBe('Orders');
    expect(orders.primaryKey).toBe('OrderId');
    expect(Object.keys(orders.attributes)).toContain('OrderId');
    console.log('Object keys %o', Object.keys(orders));
    console.log('attribute keys %o', Object.keys(orders.attributes));
  });
  describe('#find count', function () {
    it('should return the count using Callbacks', function (done) {
      // sets the response from the database
      let con = setResponse({
        result: [{
          'COUNT(*)': 1
        }]
      });

      var Connection = require('../lib/mysql-model2')(dbConfig);
      var Order = require('../models/Orders')(Connection);


      var orders = new Order();
      var count = orders.find('count', {}, function (err, result, fields) {
        expect(result).toBe(1);
        expect(con.query.mock.calls[0][0]).toBe('SELECT COUNT(*) FROM Orders');
        console.log('mock %o', con.query.mock);
        console.log('mock %o', con.query.mock.calls[0][1]);
        done();
      });

    });
    it('should return the count using Promises', function (done) {
      // sets the response from the database
      setResponse({
        result: [{
          'COUNT(*)': 1
        }]
      });

      var Connection = require('../lib/mysql-model2')(dbConfig);
      var Order = require('../models/Orders')(Connection);


      var orders = new Order();
      var count = orders.find('count', {}).then(val => {
        expect(val).toBe(1);
        done();
      });
    });
  });
});


function CustomException(message) {
  const error = new Error(message);

  error.code = 'THIS_IS_A_CUSTOM_ERROR_CODE';
  return error;
}

CustomException.prototype = Object.create(Error.prototype);
