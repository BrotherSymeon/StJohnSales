var salesDb = require('../gcpDb');


exports.OrderAmountsByMonth = function ( year ) {
  return new Promise(function(resolve, reject){
    salesDb.get().query('SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders GROUP BY MonthOfYear', year, function(err, result) {
      if (err) return reject(err);
      resolve(JSON.parse(JSON.stringify(result)));
    });
  });
 
};

