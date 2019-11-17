var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');




router.get('/users', adminController.users_list);

router.get('/users/:userId', adminController.users_detail);

router.get('/users/new', adminController.users_new);

router.get('/data', adminController.data_upload);

