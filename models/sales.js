var salesDb = require('../gcpDb');
var async = require('async');
exports.InsertIntoOrderTable = async function (lines, emitter) {
  
  var sqlDeleteStmt = 'DELETE FROM tempOrders;';
  var rows = lines;
  var sqlInsertStmt = 'INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?';
  var promises = [];
  
  promises.push(function(done){
    salesDb.get().query(sqlDeleteStmt, (err, result) => {
      if (err) return done(err);
      return done(null, result.affectedRows);
    });
  });
  
  rows.forEach((line => {
    promises.push(function(done) {
        salesDb.get().query(sqlInsertStmt, [[line]], (err, result) => {
          if (err) return done(null, err);
          return done(null, result);
        });
    });
  }));
  
  promises.push(function(done){
    salesDb.get().query(extractToOrders, (err, result) => {
      if (err) return done(err);
      return done(null, result.affectedRows);
    });
  });
 
  
  
  console.log(promises.length)
  salesDb.connect(salesDb.MODE_PROD, function(){
    
    async.series(promises, (err, results) => {
        if (err) {
            return console.log(err);
        }
        return console.log(results);
    });
    
  });
  
   
  
  
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



const extractToOrders = `INSERT INTO Orders (
  SaleDate,
  OrderId,
  DayOfYear, 
  MonthOfYear, 
  QuarterOfYear, 
  SaleYear,
  SoldThrough ,
  BuyerUserId ,
  FullName,
  FirstName ,
  LastName ,
  NumberOfItems,
  PaymentMethod ,
  DateShipped,
  Street1 ,
  Street2 ,
  ShipCity ,
  ShipState ,
  ShipZipCode ,
  ShipCountry ,
  Currency ,
  OrderValue ,
  CouponCode ,
  CouponDetails ,
  DiscountAmount,
  ShippingDiscount,
  Shipping,
  SalesTax,
  OrderTotal,
  Status,
  CardProcessingFees,
  OrderNet,
  AdjustedOrderTotal,
  AdjustedCardProcessingFees,
  AdjustedNetOrderAmount,
  Buyer ,
  OrderType ,
  PaymentType ,
  InPersonDiscount ,
  InPersonLocation 
) select
  SaleDate,
  OrderId,
  DAYOFYEAR(DATE( 
    CONCAT( 
      CONCAT('20', MID(SaleDate, 7, 2)), 
      '-', 
      MID(SaleDate, 1, 2),
      '-', 
      MID(SaleDate, 4, 2) 
      ) 
    )) as DayOfYear,
  
  MID(SaleDate, 1, 2) as SaleMonth,  
    FiscalYearStartDate( DATE( 
    CONCAT( 
      CONCAT('20', MID(SaleDate, 7, 2)), 
      '-', 
      MID(SaleDate, 1, 2),
      '-', 
      MID(SaleDate, 4, 2) 
      ) 
    )) as Quarter,
    CONCAT('20', MID(SaleDate, 7, 2)),
    IF(PaymentMethod = 'Other', 'SQUARE','ETSY'),
     BuyerUserId ,
  FullName,
  FirstName ,
  LastName ,
  NumberOfItems,
  PaymentMethod ,
  DateShipped,
  Street1 ,
  Street2 ,
  ShipCity ,
  ShipState ,
  ShipZipCode ,
  ShipCountry ,
  Currency ,
  OrderValue ,
  CouponCode ,
  CouponDetails ,
  DiscountAmount,
  ShippingDiscount,
  Shipping,
  SalesTax,
  OrderTotal,
  Status,
  CardProcessingFees,
  OrderNet,
  AdjustedOrderTotal,
  AdjustedCardProcessingFees,
  AdjustedNetOrderAmount,
  Buyer ,
  OrderType ,
  PaymentType ,
  InPersonDiscount ,
  InPersonLocation 
  FROM tempOrders;`;