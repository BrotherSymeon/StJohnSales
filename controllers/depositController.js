const debug = require('debug');
const log = debug('sales:controller:orders');
module.exports = (db) => {
  const depositController = {};

  depositController.index = async function (req, res) {
    log('loading deposits...');
    const model = new db.EtsyDeposits();
    var count = await model.find('count', {});
    const items = await model.find('all', {limit: '1, 10'});
    log('returned deposits from db = %o', items);

    const data = {
      items: JSON.parse(JSON.stringify(items)),
      totalRows: count,
      pages: Math.ceil(count / 10)
    };
    log('returned deposit data = %o', data);
    res.locals.data = data;
    return res.render('finance/deposits', {
      title: 'St Johns Sales - Etsy Deposits'
    });

  };
  depositController.getStart = function (start, pageSize) {
    var startNum = (start === 1) ? 1 : (start - 1) * pageSize;
    return startNum;
  };
  depositController.getQuery = function (params) {
    let query = {};
    if (params.sort.length) {
      query.order = params.sort[0].field;
      console.log('sort type %o', params.sort[0].type);
      if (params.sort[0].type === 'desc') {
        query.orderDESC = 'y';
      }
    }

    var start = depositController.getStart(Number(params.page), Number(params.perPage));
    query.limit = `${start}, ${params.perPage}`;

    return query;
  };
  depositController.deposits = async function (req, res) {
    log('params %o', req.body)
    var params = req.body;
    var query = depositController.getQuery(params);

    const model = new db.EtsyDeposits();
    var count = await model.find('count', {});
    //count = JSON.parse(JSON.stringify(count))[0]['COUNT(*)']; //lets move this to the  back
    const items = await model.find('all', query);

    var data = {
      rows: JSON.parse(JSON.stringify(items)),
      totalRows: count
    };
    res.json(data);
  }
  depositController.byId = async function (req, res) {
    log(`loading order number ${req.params.id}`);
    const model = new db.EtsyDeposits();
    const deposit = await model.find('first', {where: `EtsyDepositId =${req.params.id}`});
    log('returned deposit = %o', deposit);
    res.locals.deposit = deposit;
    return res.render('finance/depositDetail', {
      title: `St Johns Sales - Deposit# ${req.params.id}`
    });
  };
  return depositController;
};

