var express = require('express');

var router = express.Router();
var title = 'St Johns Sales';

var paymentController = goc.container.get('paymentController');

router.get('/', paymentController.index);

router.get('/:id', paymentController.byId);

module.exports = router;

