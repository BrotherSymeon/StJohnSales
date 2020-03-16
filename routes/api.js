var express = require('express');
var router = express.Router();


var fileProcessDetailsController = goc.container.get('fileProcessDetailsController');
var orderController = goc.container.get('orderController');
var depositController = goc.container.get('depositController');
var paymentController = goc.container.get('paymentController');
router.get('/process/:id/details', fileProcessDetailsController.processStatus);

router.post('/orders', orderController.orders);
router.post('/deposits', depositController.deposits);
router.post('/payments', paymentController.payments);





module.exports = router;
