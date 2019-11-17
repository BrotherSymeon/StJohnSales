var salesDb = require('../gcpDb');


exports.OrderAmountsByMonth = function ( year, done ) {
  salesDb.get().query('SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders GROUP BY MonthOfYear', function(err, result) {
    if (err) return done(err);
    done(null, JSON.parse(JSON.stringify(result)));
  });
};

