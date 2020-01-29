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
      totalRows: count,
      pages: Math.ceil(count / 10)
    };
    log('returned data = %o', data);
    res.locals.data = data;
    return res.render('orders/listOrders', {
      title: 'St Johns Sales - Orders'
    });

  };
  orderController.orders = async function (req, res) {
    log('params %o', req.body)
    var query = {};
    var params = req.body;
    if (params.sort.length) {
      query.order = params.sort[0].field;
      console.log('sort type %o', params.sort[0].type);
      if (params.sort[0].type === 'desc') {
        query.orderDESC = 'y';
      }
    }
    var start = Number(params.page) * Number(params.perPage);
    query.limit = `${start}, ${params.perPage}`;
    const orders = new db.BuyerOrders();
    var count = await orders.find('count', {});
    count = JSON.parse(JSON.stringify(count))[0]['COUNT(*)'];
    const items = await orders.find('all', query);

    var data = {
      rows: JSON.parse(JSON.stringify(items)),
      totalRows: count
    };
    res.json(data);
  }
  orderController.ordersById = async function (req, res) {

  };
  return orderController;
};
