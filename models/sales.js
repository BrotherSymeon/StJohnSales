var salesDb = require('../gcpDb');

exports.InsertIntoOrderTable = async function (lines) {
  var rows = lines.map((line) => line.split('\t'))
  var sqlStmt = `INSERT INTO tempOrders(  
  SaleDate VARCHAR(8) N,
  OrderId INT UNSIGNED N,
  PRIMARY KEY (O,
  BuyerUserId VARCH,
  FullName VARC,
  FirstName VARC,
  LastName VARC,
  NumberOfItems INT UNSIGNED,
  PaymentMethod VARC,
  DateShipped VAR,
  Street1 VARC,
  Street2 VARC,
  ShipCity VARC,
  ShipState VARC,
  ShipZipCode VARC,
  ShipCountry VARC,
  Currency VARCHAR(10),
  OrderValue DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(20),
  CouponDetails VARCHAR(20),
  DiscountAmount DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount DECIMAL(6,2) DEFAULT 0.0,
  Shipping DECIMAL(6,2) DEFAULT 0.0,
  SalesTax DECIMAL(6,2) DEFAULT 0.0,
  OrderTotal DECIMAL(6,2) DEFAULT 0.0,
  Status VARCHAR(20),
  CardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  OrderNet DECIMAL(6,2) DEFAULT 0.0,
  AdjustedOrderTotal DECIMAL(6,2) DEFAULT 0.00 NULL,
  AdjustedCardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  AdjustedNetOrderAmount DECIMAL(6,2) DEFAULT 0.0,
  Buyer VARCHAR(50),
  OrderType VARCHAR(50),
  PaymentType VARCHAR(50),
  InPersonDiscount DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(50))  VALUES ?  `;
  
};
exports.OrderAmountsByMonth = async function ( year, soldThrough ) {
  var params = [year, soldThrough];
  return new Promise(function(resolve, reject){
    salesDb.connect(salesDb.MODE_PROD, function(){
      salesDb.get().query('SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY MonthOfYear', params, function(err, result) {
        if (err) return reject(err);
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    
    
    
   
  });
 
};

exports.OrderAmountsByQuarter = async function( year, soldThrough ) {
  //SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear=? GROUP BY MonthOfYear;
  var params = [year, soldThrough];
    return new Promise(function(resolve, reject){
    salesDb.connect(salesDb.MODE_PROD, function(){
      salesDb.get().query(' SELECT QuarterOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY QuarterOfYear;', params, function(err, result) {
        if (err) return reject(err);
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
   
  });
};
