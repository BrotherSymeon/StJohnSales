const debug = require('debug');
const log = debug('sales:controller:orders');
module.exports = (db) => {
  const orderController = {};

  orderController.index = async function (req, res) {
    log('loading orders...');
    const orders = new db.BuyerOrders();
    var count = await orders.find('count', {});
    const items = await orders.find('all', {limit: '1, 10'});

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
  orderController.getStart = function (start, pageSize) {
    var startNum = (start === 1) ? 1 : (start - 1) * pageSize;
    return startNum;
  };
  orderController.getQuery = function (params) {
    let query = {};
    if (params.sort.length) {
      query.order = params.sort[0].field;
      console.log('sort type %o', params.sort[0].type);
      if (params.sort[0].type === 'desc') {
        query.orderDESC = 'y';
      }
    }

    var start = orderController.getStart(Number(params.page), Number(params.perPage));
    query.limit = `${start}, ${params.perPage}`;

    return query;
  };
  orderController.orders = async function (req, res) {
    log('params %o', req.body)
    var params = req.body;
    var query = orderController.getQuery(params);

    const orders = new db.BuyerOrders();
    var count = await orders.find('count', {});
    //count = JSON.parse(JSON.stringify(count))[0]['COUNT(*)']; //lets move this to the  back
    const items = await orders.find('all', query);

    var data = {
      rows: JSON.parse(JSON.stringify(items)),
      totalRows: count
    };
    res.json(data);
  }
  orderController.byOrderId = async function (req, res) {
    log(`loading order number ${req.params.id}`);
    const detail = new db.OrderDetail();
    const orderItems = new db.OrderItems();
    const item = await detail.find('first', {where: `OrderId =${req.params.id}`});
    var itemList = await orderItems.find('all', {where: `OrderId =${req.params.id}`});
    itemList = JSON.parse(JSON.stringify(itemList));
    log('returned data = %o', item);
    log('returned itemList = %o', itemList);
    res.locals.detail = item;
    res.locals.itemList = itemList;
    return res.render('orders/orderDetail', {
      title: `St Johns Sales - Order# ${req.params.id}`
    });
  };
  return orderController;
};
