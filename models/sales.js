var salesDb = require('../gcpDb');


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
