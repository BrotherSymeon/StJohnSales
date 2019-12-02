
var { diContainer }  = require('../diContainer');

module.exports = {
  
  config: function() {
    diContainer.factory('dbConfig', require('./db'));
    diContainer.factory('salesDb', require("../gcpDb"));
    diContainer.factory('utils', require('../lib/utilities'));
    diContainer.factory('orderService', require('../helpers/orders'));
    diContainer.factory('mySqlConnection', require('../lib/mysql-model2'));
    //diContainer.factory('mySqlConnection', require('../db/connection'));

    //MODELS ---->
    diContainer.factory('processDetailsModel', require('../models/FileProcessDetails'));
    diContainer.factory('processModel', require('../models/FileProcess'));
    diContainer.factory('salesModel', require('../models/sales'));
    diContainer.factory('db', require('../models'));

    //CONTROLLERS----->
    diContainer.factory('adminController', require('../controllers/adminController'));
    diContainer.factory('fileProcessController', require('../controllers/fileProcessController'));

    global.goc = {};
    goc.container = diContainer;
  }
}

