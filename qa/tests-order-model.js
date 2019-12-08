var expect = require('chai').expect;

var connection = {};

connection.extend = function(){
  var f = function(){
    this.tableName = 'Orders';
  }
  f.OrderAmountsByQuarter = async (year, soldThroug) => {
    return [];
  }
  f.OrderAmountsByMonth = async (year, soldThrough) => {
    return [];
  }
  return f;
}
var orderModel = require('../models/Orders')(connection);



suite('Order Model', function(){
  test(' should return an object', function(){
    expect(typeof orderModel === 'object');
  }); 
  test(' new Order Model object has tableName set to Orders', function(){
    var t = new orderModel();
    expect(t.tableName === 'Orders');
  });
  
});