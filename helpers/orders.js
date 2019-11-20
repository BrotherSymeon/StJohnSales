
let Enumeration = require('../lib/enumeration');

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



exports.process = function(data){
  let retval = [];
  var lines = data.split('\n');
  console.log(lines.length)
}








exports.process = function (data) {
 
  let retval = [];
  const lines = data.split('\n');

  lines.forEach((val, i, array) => {
    //val is a comma seperated line
    val = replaceCommasInDoubleQuotes(val)
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
          console.log(removeCharacters( elem, '"' ));
          lineData[index] = Number(removeCharacters( elem, '"' ));
        }else{
          lineData[index] = removeCharacters( elem, '"' );
        }

      });
      retval.push( lineData.join('\t') );
    }


  });

  return retval;

};


var removeCharacters = function(str, remove){
  var out = '';
  
  Array.from(str).forEach((i) =>{
    if(i !== remove){
      out += i;
    }else{
      out += '';
    }
  });
  return out;
};

var replaceCommasInDoubleQuotes = function(str){
  var isBetweenQuotes = false;
  var out = '';
  Array.from(str).forEach((i) => {
    if(i === '"' && isBetweenQuotes === false){
      isBetweenQuotes = true;
    }else if(i === '"' && isBetweenQuotes === true){
      isBetweenQuotes = false;
    }

    if(i === ',' && isBetweenQuotes){
      out += '';
    }else{
      out += i;
    }
  });

  return out;
};
