
var async = require("async");

module.exports = (salesDb) => {
  orderModel = {};

  orderModel.InsertIntoOrderTable = function(lines, e, processId, cb) {
    var sqlDeleteStmt = "DELETE FROM tempOrders;";
    var rows = lines;
    var sqlInsertStmt =
      "INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?";
    var promises = [];
    var errors = [];
  
    promises.push(function(done) {
      salesDb.get().query(sqlDeleteStmt, (err, result) => {
        if (err) return done(err);
  
        e.emit("ClearedPrepTableProcess", {
          processId: processId,
          message: `Cleared Prep Table`,
          percentDone: null
        });
  
        return done(null, result.affectedRows);
      });
    });
  
    rows.forEach((line, index) => {
      promises.push(function(done) {
        salesDb.get().query(sqlInsertStmt, [[line]], (err, result) => {
          if (err) {
            errors.push({ err, result });
            return done(null, err);
          }
          var total = rows.length;
          e.emit("SavedDataLine", {
            processId: processId,
            message: `Saved data line ${index} of ${total} to prep table`,
            percentDone: (index / total) * 100
          });
          return done(null, result);
        });
      });
    });
  
    promises.push(function(done) {
      e.emit("BeginFinalProcessing", {
        processId: processId,
        message: `Begining Final Process`,
        percentDone: null
      });
      salesDb.get().query(extractToOrders, (err, result) => {
        if (err) return done(err);
  
        e.emit("CompleteFinalProcessing", {
          processId: processId,
          message: `Final Process done. ${result.affectedRows} entries added to order table.`,
          percentDone: null
        });
        console.log(result.affectedRows);
        return done(null, result.affectedRows);
      });
    });
  
    console.log(promises.length);
    salesDb.connect(salesDb.MODE_PROD, function() {
      async.series(promises, (err, results) => {
        if (err) {
          console.log(err);
        }
        //console.log(errors)
        //console.log(JSON.parse(JSON.stringify(results)));
        e.emit("Done", {
          processId: processId,
          message: "Done",
          percentDone: 100,
          errors: errors,
          results: JSON.parse(JSON.stringify(results))
        });
        if(cb){
          cb(JSON.parse(JSON.stringify(results)));
        }
      });
    });
  };

  orderModel.OrderAmountsByMonth = async function(year, soldThrough) {
    var params = [year, soldThrough];
    return new Promise(function(resolve, reject) {
      salesDb.connect(salesDb.MODE_PROD, function() {
        salesDb
          .get()
          .query(
            "SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY MonthOfYear",
            params,
            function(err, result) {
              if (err) return reject(err);
              resolve(JSON.parse(JSON.stringify(result)));
            }
          );
      });
    });
  };
  
  orderModel.OrderAmountsByQuarter = async function(year, soldThrough) {
    //SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear=? GROUP BY MonthOfYear;
    var params = [year, soldThrough];
    return new Promise(function(resolve, reject) {
      salesDb.connect(salesDb.MODE_PROD, function() {
        salesDb
          .get()
          .query(
            " SELECT QuarterOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY QuarterOfYear;",
            params,
            function(err, result) {
              if (err) return reject(err);
              resolve(JSON.parse(JSON.stringify(result)));
            }
          );
      });
    });
  };

  return orderModel;
};







const extractToOrders = `
INSERT INTO Orders (
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
  FROM tempOrders t 
  WHERE NOT EXISTS
    (SELECT 1
     FROM Orders o
     WHERE o.OrderId = t.OrderId);
`;
