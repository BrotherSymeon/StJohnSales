var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');




router.get('/users', adminController.users_list);

router.get('/users/:userId', adminController.users_detail);

router.get('/users/new', adminController.users_new);

router.get('/upload', adminController.data_upload);

router.post('/upload/orders', adminController.upload_orders)

module.exports = router;