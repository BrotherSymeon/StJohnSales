const debug = require('debug');
const log = debug('sales:controller:orders');
module.exports = (db) => {
  const orderController = {};

  orderController.index = async function (req, res) {
    log('loading orders...');
    const orders = new db.BuyerOrders();
    var count = await orders.find('count', {});
    const items = await orders.find('all', {limit: '1, 10'});
    count = JSON.parse(JSON.stringify(count))[0]['COUNT(*)'];

    const data = {
      items: JSON.parse(JSON.stringify(items)),
      count: count,
      pages: Math.ceil(count / 10)
    };
    log('returned data = %o', data);
    res.locals.data = data;
    return res.render('orders/listOrders', {
      title: 'St Johns Sales - Orders'
    });

  };
  return orderController;
};
