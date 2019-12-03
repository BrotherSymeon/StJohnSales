
var fileProcess = require('./FileProcess');
var fileProcessDetails = require('./FileProcessDetails');
var orders = require('./Orders');
var orderItems = require('./OrderItems');
var users = require('./Users');
var tempOrders = require('./tempOrders');
var tempOrderItems = require('./tempOrderItems');


module.exports = (mySqlConnection) => {
  const db = {
    FileProcesses: fileProcess(mySqlConnection),
    FileProcessDetails: fileProcessDetails(mySqlConnection),
    Orders: orders(mySqlConnection),
    OrderItems: orderItems(mySqlConnection),
    Users: users(mySqlConnection),
    TempOrders: tempOrders(mySqlConnection),
    TempOrderItems:tempOrderItems(mySqlConnection)
  };

  return db;

}