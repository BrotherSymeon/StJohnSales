
var db = require('../gcpDb');
var Sales = require('../models/sales')(db());


exports.dashboard = async function(req, res) {
  try{
    var etsyMonthlyData = await Sales.OrderAmountsByMonth(2019, 'ETSY');
    var etsyQuarterlyData = await Sales.OrderAmountsByQuarter(2019, 'ETSY');
    var squareMonthlyData = await Sales.OrderAmountsByMonth(2019, 'SQUARE');
    var squareQuarterlyData = await Sales.OrderAmountsByQuarter(2019, 'SQUARE');
    //console.log(data)
    res.locals.etsyMonthlyData = etsyMonthlyData;
    res.locals.etsyQuarterlyData = etsyQuarterlyData;
    res.locals.squareMonthlyData = squareMonthlyData;
    res.locals.squareQuarterlyData = squareQuarterlyData;
    
    return res.render('index', { title : 'St Johns Sales'});
  }catch(err){
    console.error(err.message);
    return res.render('index', { title : 'St Johns Sales'});
  }
  
  
};