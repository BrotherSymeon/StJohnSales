let emitter = require('events').EventEmitter;
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
  let retval = [];
  const lines = data.split('\n');
  e.emit('BeginProcess', {
    processId: processId,
    message: `Processing ${fileName}: ${lines.length} lines of data to process.`
  });
  lines.forEach((val, i, array) => {
    //val is a comma seperated line
    val = utils.replaceCommasInDoubleQuotes(val)
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
      retval.push( lineData.join('\t') );
    }


  });

  return e;

};



