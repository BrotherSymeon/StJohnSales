var express = require('express');
var router = express.Router();


var fileProcessDetailsController = goc.container.get('fileProcessDetailsController');
var orderController = goc.container.get('orderController');
router.get('/process/:id/details', fileProcessDetailsController.processStatus);

router.post('/orders', orderController.orders);

router.get('/orders/:id', orderController.ordersById);




module.exports = router;
