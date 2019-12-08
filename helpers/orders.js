let emitter = require('events').EventEmitter;
let Enumeration = require('../lib/enumeration');
let async = require('async');


module.exports = (utils, db) => {
  const ordersService = {};

  ordersService.process = function (data, {processId, fileName}) {
    var processor = ordersService.processData(data, processId, fileName);
    
    processor.on('BeginFileProcess', function (data) {
      console.log('File Process has Begun: ' + data.message);
      saveMessage(processId, data);
     
    });
    processor.on('FileLineProcess', function (data) {
      saveMessage(processId, data);
      //console.log('Line of File has been read: ' + data);
    });
    processor.on('EndFileProcess', function(data) {
      saveMessage(processId, data);
      console.log('File Process has Ended: ' + data.message);
    })
    processor.on('BeginDataInsertProcess', function (data) {
      console.log('Begining Writing to DB: ' + data.message);
      saveMessage(processId, data);
    });
    processor.on('EndDataInsertProcess', function (data) {
      console.log('Finished Writing to DB: ', data);
      saveMessage(processId, data);
    });
    processor.on('ClearedPrepTableProcess', function(data) {
      console.log('Deleted all form tempOrders table: ',data);
      saveMessage(processId, data);
    });
    processor.on('SavedDataLine', function(data) {
      saveMessage(processId, data);
      //console.log('Saved Data Line to tempOrders table: ', data);
    });
    processor.on('BeginFinalProcessing', function(data) {
      console.log('begin moving data from tempOrders to Orders : ', data);
      saveMessage(processId, data);
    });
    processor.on('CompleteFinalProcessing', function(data) {
      console.log('end moving data from tempOrders to Orders : ', data);
      saveMessage(processId, data);
    });
    processor.on('Done', function(data) {
      //console.log('Done : ;-)');
      //saveMessage(processId, data);
    });
    
  };

  ordersService.insertIntoTempOrderTable = (lines, e, processId, cb) => {
    var rows = lines;
    var promises = [];
    var errors = [];
    var tempOrdersModel = new db.TempOrderItems();

    // delete from the tem table
    promises.push(function(done) {
      tempOrdersModel.query(ordersService.deleteTempOrdersTableSQL(), (err, result) => {
        if (err) return done(err);
  
        e.emit("ClearedPrepTableProcess", {
          processId: processId,
          message: `Cleared Order temp Table`,
          percentDone: null
        });
  
        return done(null, result.affectedRows);
      });
    });

    //insert each one by one
    rows.forEach((line, index) => {
      promises.push(function(done) {
        tempOrdersModel.queryOptions(ordersService.insertIntoTempOrdersTableSQL(), [[line]], (err, result) => {
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
      tempOrdersModel.query( ordersService.extractToOrders(), (err, result) => {
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

    //run all of the functions
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



  };

  ordersService.processData = (data, processId, fileName) => {
    var e = new emitter();
  
    setTimeout(function(){
      
      let cleanData = [];
      const lines = data.split('\n');
      e.emit('BeginFileProcess', {
        processId: processId,
        message: `Processing ${fileName}: ${lines.length} lines of data to process.`,
        percentDone: 0
      });
      lines.forEach((val, i, array) => {
        e.emit('FileLineProcess', {
          processId: processId,
          message: `Processing ${fileName}: processing line ${i} of ${lines.length} lines.`,
          percentDone: (((i / lines.length)* .25) * 100)
        });
        //val is a comma seperated line
        val = utils.replaceCommasInDoubleQuotes(val);
        if (i > 0) {
          let lineData = val.split(',');
  
          lineData.forEach((elem, index) => {
  
            if ([OrderColumns.ADJUSTEDCARDPROCESSINGFEES,
            OrderColumns.ADJUSTEDNETORDERAMOUNT,
            OrderColumns.CARDPROCESSINGFEES,
            OrderColumns.INPERSONDISCOUNT,
            OrderColumns.ADJUSTEDORDERTOTAL,
            OrderColumns.ORDERTOTAL,
            OrderColumns.SHIPPING,
            OrderColumns.SHIPPINGDISCOUNT,
            OrderColumns.SALESTAX,
            OrderColumns.DISCOUNTAMOUNT,
            OrderColumns.ORDERVALUE,
            OrderColumns.ORDERNET].includes(index)) {
              //console.log(utils.removeCharacters( elem, '"' ));
              lineData[index] = Number(utils.removeCharacters( elem, '"' ));
            }else{
              lineData[index] = utils.removeCharacters( elem, '"' );
            }
          });
          
          if(lineData.length === 35){
            // only insert ones with a row length of 35
            cleanData.push( lineData );
          } else {
            //console.log(`linedata length: ${lineData.length}`);
            //console.log(lineData);
          }
          
        }
      });
      e.emit('EndFileProcess', {
        processId: processId,
        message: `Processing ${fileName}: ${lines.length} lines DONE.`,
        percentDone: (1*.25)*100
      });
      e.emit('BeginDataInsertProcess', {
        processId: processId,
        message: `Inserting DataRows from ${fileName} into tempOrders.`,
        percentDone: (.25)*100
      });
      ordersService.insertIntoTempOrderTable(cleanData, e, processId, function(results){
        var inserted = results[results.length-1];
        e.emit('EndDataInsertProcess', {
          processId: processId,
          message: `Inserted ${inserted} DataRows from ${fileName} into tempOrders.`,
          percentDone: 100,
          complete: false
        });
      });
  
  
      }, 2000);
    
  
    
    return e;
  };

  ordersService.deleteTempOrdersTableSQL = () =>{
    return "DELETE FROM tempOrders;";
  };

  ordersService.insertIntoTempOrdersTableSQL = () => {
    return "INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?";
  };

  ordersService.extractToOrders = () => {
    return `
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
  }

  var saveMessage = (procId, data) => {
    var detail = new db.FileProcessDetails({
       DetailType: 'MESSAGE',
       DetailMessage: data.message,
       FileId: procId,
       PercentDone: data.percentDone || 0
     });
     detail.save((err, result) => {
       if(err) console.log(err);
       //console.log(result);
     });
  };

  return ordersService;
}

let OrderColumns = new Enumeration([
  'SaleDate',
  'OrderId',
  'BuyerUserId',
  'FullName',
  'FirstName',
  'LastName',
  'NumberOfItems',
  'PaymentMethod',
  'DateShipped',
  'Street1',
  'Street2',
  'ShipCity',
  'ShipState',
  'ShipZipCode',
  'ShipCountry',
  'Currency',
  'OrderValue',
  'CouponCode',
  'CouponDetails',
  'DiscountAmount',
  'ShippingDiscount',
  'Shipping',
  'SalesTax',
  'OrderTotal',
  'Status',
  'CardProcessingFees',
  'OrderNet',
  'AdjustedOrderTotal',
  'AdjustedCardProcessingFees',
  'AdjustedNetOrderAmount',
  'Buyer',
  'OrderType',
  'PaymentType',
  'InPersonDiscount',
  'InPersonLocation']);







