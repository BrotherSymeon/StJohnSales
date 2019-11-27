let emitter = require('events').EventEmitter;
let Sales = require('../models/sales');
let Enumeration = require('../lib/enumeration');
let utils = require('../lib/utilities');
let FileProcessDetails = require('../models/FileProcessDetails')


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





const processData = (data, processId, fileName) => {
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
        percentDone: ((i / lines.length) * 100)
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
    Sales.InsertIntoOrderTable(cleanData, e, processId, function(results){
      console.log(results[results.length-1])
      e.emit('EndDataInsertProcess', {
        processId: processId,
        message: `Inserted ${0} DataRows from ${fileName} into tempOrders.`,
        percentDone: 100,
        complete: false
      });
    });


    }, 2000);
  

  
  return e;
};



exports.process = function (data, {processId, fileName}) {
  

  var processor = processData(data, processId, fileName)
  
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
    console.log('Begining Writing to Memeory: ' + data.message);
    saveMessage(processId, data);
  });
  processor.on('EndDataInsertProcess', function (data) {
    console.log('Finished Writing to Memory: ', data);
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
    console.log('Done : ;-)');
    saveMessage(processId, data);
  });
  
};


var saveMessage = (procId, data) => {
   var detail = new FileProcessDetails({
      DetailType: 'MESSAGE',
      DetailMessage: data.message,
      FileId: procId,
      
    });
    detail.save((err, result) => {
      if(err) console.log(err);
      //console.log(result);
    });
};


