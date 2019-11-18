var Sales = require('../models/sales');

exports.dashboard = async function(req, res) {
  
  //var data = await Sales.OrderAmountsByMonth(2019);
  return res.render('index', { title : 'St Johns Sales'});
  
};