var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
/* var { diContainer }  = require('../diContainer');
diContainer.factory('dbConfig', require('../config/db'));
diContainer.factory('salesDb', require("../gcpDb"));
diContainer.factory('utils', require('../lib/utilities'));
diContainer.factory('orderService', require('../helpers/orders'));

diContainer.factory('mySqlConnection', require('../lib/mysql-model2'));
diContainer.factory('processModel', require('../models/FileProcess'));
diContainer.factory('salesModel', require('../models/sales'));
diContainer.factory('adminController', require('../controllers/adminController')); */

var adminController = goc.container.get('adminController');


router.get('/users', adminController.users_list);

router.get('/users/:userId', adminController.users_detail);

router.get('/users/new', adminController.users_new);

router.get('/upload', adminController.data_upload);

router.post('/upload/orders',upload.single('orders'), adminController.upload_orders)

module.exports = router;