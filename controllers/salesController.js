var Sales = require('../models/sales');
var someAsync = require('../helpers/someAsync');

exports.dashboard = async function(req, res) {
  
  var data = await Sales.OrderAmountsByMonth(2019);
  return res.render('index', { title : 'St Johns Sales'});
  
};