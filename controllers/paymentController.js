const debug = require('debug');
const log = debug('sales:controller:paments');
module.exports = (db) => {
  const paymentController = {};

  paymentController.index = async function (req, res) {
    log('loading payments...');
    const model = new db.EtsyPayments();
    var count = await model.find('count', {});
    const items = await model.find('all', {limit: '1, 10'});

    log('returned items from db = %o', items);
    const data = {
      items: JSON.parse(JSON.stringify(items)),
      totalRows: count,
      pages: Math.ceil(count / 10)
    };
    log('returned data = %o', data);
    res.locals.data = data;
    return res.render('finance/payments', {
      title: 'St Johns Sales - Payments'
    });

  };
  paymentController.getStart = function (start, pageSize) {
    var startNum = (start === 1) ? 1 : (start - 1) * pageSize;
    return startNum;
  };
  paymentController.getQuery = function (params) {
    let query = {};
    if (params.sort.length) {
      query.order = params.sort[0].field;
      console.log('sort type %o', params.sort[0].type);
      if (params.sort[0].type === 'desc') {
        query.orderDESC = 'y';
      }
    }

    var start = paymentController.getStart(Number(params.page), Number(params.perPage));
    query.limit = `${start}, ${params.perPage}`;

    return query;
  };
  paymentController.payments = async function (req, res) {
    log('params %o', req.body)
    var params = req.body;
    var query = paymentController.getQuery(params);

    const model = new db.EtsyPayments();
    var count = await model.find('count', {});
    const items = await model.find('all', query);
    log('payments from db %o ', items);
    var data = {
      rows: JSON.parse(JSON.stringify(items)),
      totalRows: count
    };
    res.json(data);
  }
  paymentController.byId = async function (req, res) {
    log(`loading payment byId ${req.params.id}`);
    const model = new db.EtsyPayments();
    const item = await model.find('first', {where: `PaymentID =${req.params.id}`});
    log('returned data = %o', item);
    res.locals.detail = item;
    return res.render('finance/paymentDetail', {
      title: `St Johns Sales - Payment# ${req.params.id}`
    });
  };
  return paymentController;
};

