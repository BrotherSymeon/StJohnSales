let emitter = require('events').EventEmitter;
let Enumeration = require('../lib/enumeration');
let async = require('async');


module.exports = (utils, db) => {
  const orderItemsService = {};

  orderItemsService.process = function (data, {processId, fileName}) {
    var processor = orderItemsService.processOrderItemsData(data, processId, fileName);
    
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

  orderItemsService.insertIntoTempOrderItemsTable = (lines, e, processId, cb) => {
    var rows = lines;
    var promises = [];
    var errors = [];
    var tempOrderItemsModel = new db.TempOrderItems();

    // delete from the tem table
    promises.push(function(done) {
      tempOrderItemsModel.query(orderItemsService.deleteTempOrderItemsTableSQL(), (err, result) => {
        if (err) return done(err);
  
        e.emit('ClearedPrepTableProcess', {
          processId: processId,
          message: `Cleared Order Items temp Table`,
          percentDone: null
        });
  
        return done(null, result.affectedRows);
      });
    });

    //insert each one by one
    rows.forEach((line, index) => {
      promises.push(function(done) {
        tempOrderItemsModel.queryOptions(orderItemsService.insertIntoTempOrderItemsTableSQL(), [[line]], (err, result) => {
          if (err) {
            errors.push({ err, result });
            return done(null, err);
          }
          var total = rows.length;
          e.emit('SavedDataLine', {
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
      tempOrderItemsModel.query( orderItemsService.extractToOrderItems(), (err, result) => {
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

  orderItemsService.processOrderItemsData = (data, processId, fileName) => {
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
  
            if ([OrderItemColumns.QUANTITY,
            OrderItemColumns.PRICE,
            OrderItemColumns.VATPAIDBYBUYER,
            OrderItemColumns.INPERSONDISCOUNT,
            OrderItemColumns.ADJUSTEDORDERTOTAL,
            OrderItemColumns.ITEMTOTAL,
            OrderItemColumns.ORDERSALESTAX,
            OrderItemColumns.ITEMTOTAL,
            OrderItemColumns.ORDERSHIPPING,
            OrderItemColumns.SHIPPINGDISCOUNT,
            OrderItemColumns.DISCOUNTAMOUNT].includes(index)) {
              //console.log(utils.removeCharacters( elem, '"' ));
              lineData[index] = Number(utils.removeCharacters( elem, '"' ));
            }else{
              lineData[index] = utils.removeCharacters( elem, '"' );
            }
          });
          
          if(lineData.length === 32){
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
        message: `Inserting DataRows from ${fileName} into tempOrderItems.`,
        percentDone: (.25)*100
      });
      orderItemsService.insertIntoTempOrderItemsTable(cleanData, e, processId, function(results){
        var inserted = results[results.length-1];
        e.emit('EndDataInsertProcess', {
          processId: processId,
          message: `Inserted ${inserted} DataRows from ${fileName} into tempOrderItems.`,
          percentDone: 100,
          complete: false
        });
      });
  
  
      }, 2000);
    
  
    
    return e;
  };

  orderItemsService.deleteTempOrderItemsTableSQL = () =>{
    return "DELETE FROM tempOrderItems;";
  };

  orderItemsService.insertIntoTempOrderItemsTableSQL = () => {
    return `INSERT INTO tempOrderItems(
      SaleDate,
      ItemName,
      Buyer,
      Quantity,
      Price,
      CouponCode,
      CouponDetails,
      DiscountAmount,
      ShippingDiscount,
      OrderShipping,
      OrderSalesTax,
      ItemTotal,
      Currency,
      TransactionID,
      ListingID,
      DatePaid,
      DateShipped,
      ShipName,
      ShipAddress1,
      ShipAddress2,
      ShipCity,
      ShipState,
      ShipZipcode,
      ShipCountry,
      OrderID,
      Variations,
      OrderType,
      ListingsType,
      PaymentType,
      InPersonDiscount,
      InPersonLocation,
      VATPaidbyBuyer
    )  VALUES ?`;
  };

  orderItemsService.extractToOrderItems = () => {
    return `
      INSERT INTO OrderItems(
        SaleDate,
        ItemName,
        Buyer,
        Quantity,
        Price,
        CouponCode,
        CouponDetails,
        DiscountAmount,
        ShippingDiscount,
        OrderShipping,
        OrderSalesTax,
        ItemTotal,
        Currency,
        TransactionID,
        ListingID,
        DatePaid,
        DateShipped,
        ShipName,
        ShipAddress1,
        ShipAddress2,
        ShipCity,
        ShipState,
        ShipZipcode,
        ShipCountry,
        OrderID,
        Variations,
        OrderType,
        ListingsType,
        PaymentType,
        InPersonDiscount,
        InPersonLocation,
        VATPaidbyBuyer
      ) select
      DATE( 
        CONCAT( 
          CONCAT('20', MID(SaleDate, 7, 2)), 
          '-', 
          MID(SaleDate, 1, 2),
          '-', 
          MID(SaleDate, 4, 2) 
          ) 
        ) as SaleDate,
      ItemName,
      Buyer,
      Quantity,
      Price,
      CouponCode,
      CouponDetails,
      DiscountAmount,
      ShippingDiscount,
      OrderShipping,
      OrderSalesTax,
      ItemTotal,
      Currency,
      TransactionID,
      ListingID,
      IF (DatePaid = '',
        NULL,
        DATE( 
          CONCAT( 
            MID(DatePaid, 7, 4), 
            '-', 
            MID(DatePaid, 1, 2),
            '-', 
            MID(DatePaid, 4, 2) 
            ) 
          ) 
        ) as DatePaid,
        IF (DateShipped = '', 
          NULL,
          DATE( 
            CONCAT( 
              MID(DateShipped, 7, 4), 
              '-', 
              MID(DateShipped, 1, 2),
              '-', 
              MID(DateShipped, 4, 2) 
              ) 
            ) 
          ) as DateShipped,
      ShipName,
      ShipAddress1,
      ShipAddress2,
      ShipCity,
      ShipState,
      ShipZipcode,
      ShipCountry,
      OrderID,
      Variations,
      OrderType,
      ListingsType,
      PaymentType,
      InPersonDiscount,
      InPersonLocation,
      VATPaidbyBuyer
        FROM tempOrderItems t 
        WHERE NOT EXISTS
          (SELECT 1
          FROM OrderItems o
          WHERE o.OrderID = t.OrderID)
        AND EXISTS
          (SELECT 1
          FROM Orders r
          WHERE r.OrderId = t.OrderID);
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

  return orderItemsService;
}



let OrderItemColumns = new Enumeration([
  'SaleDate',
  'ItemName',
  'Buyer',
  'Quantity',
  'Price',
  'CouponCode',
  'CouponDetails',
  'DiscountAmount',
  'ShippingDiscount',
  'OrderShipping',
  'OrderSalesTax',
  'ItemTotal',
  'Currency',
  'TransactionID',
  'ListingID',
  'DatePaid',
  'DateShipped',
  'ShipName',
  'ShipAddress1',
  'ShipAddress2',
  'ShipCity',
  'ShipState',
  'ShipZipcode',
  'ShipCountry',
  'OrderID',
  'Variations',
  'OrderType',
  'ListingsType',
  'PaymentType',
  'InPersonDiscount',
  'InPersonLocation',
  'VATPaidbyBuyer'
]);








