
var fileProcess = require('./FileProcess');
var fileProcessDetails = require('./FileProcessDetails');
var orders = require('./Orders');
var orderItems = require('./OrderItems');
var users = require('./Users');
var tempOrders = require('./tempOrders');
var tempOrderItems = require('./tempOrderItems');
var buyerOrders = require('./BuyerOrders');
var orderDetail = require('./OrderDetail');
var etsyListing = require('./EtsyListing');
var etsyPayment = require('./EtsyPayment');
var etsyDeposit = require('./EtsyDeposit');



module.exports = (mySqlConnection) => {
  const db = {
    FileProcesses: fileProcess(mySqlConnection),
    FileProcessDetails: fileProcessDetails(mySqlConnection),
    Orders: orders(mySqlConnection),
    OrderItems: orderItems(mySqlConnection),
    Users: users(mySqlConnection),
    TempOrders: tempOrders(mySqlConnection),
    TempOrderItems: tempOrderItems(mySqlConnection),
    BuyerOrders: buyerOrders(mySqlConnection),
    OrderDetail: orderDetail(mySqlConnection),
    EtsyDeposits: etsyDeposit(mySqlConnection),
    EtsyPayments: etsyPayment(mySqlConnection),
    EtsyListings: etsyListing(mySqlConnection)
  };

  return db;

};
