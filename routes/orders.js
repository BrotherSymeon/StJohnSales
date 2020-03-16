var express = require('express');

var router = express.Router();
var title = 'St Johns Sales';

var orderController = goc.container.get('orderController');

router.get('/', orderController.index);

router.get('/:id', orderController.byOrderId);

module.exports = router;

