var salesDb = require('../gcpDb');
var async = require('async');
exports.InsertIntoOrderTable = async function (lines, emitter) {
  
  var sqlDeleteStmt = 'DELETE FROM tempOrders;';
  var rows = lines;
  var sqlInsertStmt = 'INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?';
  //console.log('first  row');
  //console.log([[rows[0]]]);
  //var query = salesDb.get().query(sqlInsertStmt, [[rows[0]]], function(err, result) {
  //      if (err) return console.log(err);
  //      return Promise.resolve(result.affectedRows);
  //    });
  //console.log(query.sql);
    
  var promises = [];
  
  promises.push(function(done){
    salesDb.get().query(sqlDeleteStmt, (err, result) => {
      if (err) return done(err);
      return done(null, result.affectedRows);
    });
  });
  
  promises.push(function(done) {
    salesDb.get().query(sqlInsertStmt, [[rows]], (err, result) => {
      if (err) return done(err);
      return done(null, result);
    });
  });
  
  salesDb.connect(salesDb.MODE_PROD, function(){
    
    async.series(promises, (err, results) => {
        if (err) {
            return console.log(err);
        }
        return rconsole.log(results);
    });
    
  });
  
   
  
  //return new Promise(function(resolve, reject){
  //  salesDb.connect(salesDb.MODE_PROD, function(){
  //    promises.reduce((promiseChain, currentArray) => {
  //      console.log(currentArray);
  //      return promiseChain.then(chainResults =>
  //              Promise.all(currentArray).then(currentResult => currentResult)
  //          );
  //      }, Promise.resolve([])).then(arrayOfArraysOfResults => {
  //          // Do something with all results
  //          console.log(arrayOfArraysOfResults);
  //          resolve(arrayOfArraysOfResults);
  //    }).catch(function(err){
  //      console.log(err);
  //    });
  //  });
  //});
  
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
