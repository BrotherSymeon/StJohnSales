var salesDb = require('../gcpDb');

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
  promises.push(new Promise(function(resolve, reject){
    salesDb.get().query(sqlDeleteStmt, function(err, result){
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  }));
  
  promises.concat(rows.map(function(line) {
    
    return new Promise(function(resolve, reject){
      var query = salesDb.get().query(sqlInsertStmt, [[line]], function(err, result) {
        if (err) return reject(err);
         resolve(result.affectedRows);
      });
     
    });
  }));
  
  return new Promise(function(resolve, reject){
    salesDb.connect(salesDb.MODE_PROD, function(){
      
      promises.reduce((promiseChain, currentArray) => {
        return promiseChain.then(chainResults =>
                Promise.all(currentArray).then(currentResult =>
                    [...chainResults, currentResult]
                )
            );
        }, Promise.resolve([])).then(arrayOfArraysOfResults => {
            // Do something with all results
            console.log(arrayOfArraysOfResults);
            resolve(arrayOfArraysOfResults);
      }).catch(function(err){
        console.log(err);
      });
      
      //Promise.all(promises).then(values => { 
      //  console.log(values); // [3, 1337, "foo"] 
      //  resolve(values)
      //});
      
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
