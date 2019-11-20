let emitter = require('events').EventEmitter;
let Sales = require('../models/sales');
let Enumeration = require('../lib/enumeration');
let utils = require('../lib/utilities');

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









exports.process = function (data, {processId, fileName}) {
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
            console.log(utils.removeCharacters( elem, '"' ));
            lineData[index] = Number(utils.removeCharacters( elem, '"' ));
          }else{
            lineData[index] = utils.removeCharacters( elem, '"' );
          }
        });
        cleanData.push( lineData.join('\t') );
      }
    });
    
    await Sales.InsertIntoOrderTable(cleanData)


    }, 2000);
  

  
  return e;

};



