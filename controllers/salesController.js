var Sales = require('../models/sales');
var someAsync = require('../helpers/someAsync');

exports.dashboard = async function(req, res) {
  try{
    var data = await Sales.OrderAmountsByMonth(2019);
    var quarterData = await Sales.OrderAmountsByQuarter(2019);
    //console.log(data)
    res.locals.data = data;
    res.locals.quarterData = quarterData;
    return res.render('index', { title : 'St Johns Sales'});
  }catch(err){
    console.error(err);
    return res.render('index', { title : 'St Johns Sales'});
  }
  
  
};