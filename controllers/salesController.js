var Sales = require('../models/sales');
var someAsync = require('../helpers/someAsync');

exports.dashboard = async function(req, res) {
  try{
    var data = await Sales.OrderAmountsByMonth(2019);
    console.log(data)
    res.locals.data = [2,3,6,8,54,34,3];
    return res.render('index', { title : 'St Johns Sales', data: [3,4,5]});
  }catch(err){
    console.error(err)
    return res.render('index', { title : 'St Johns Sales'});
  }
  
  
};