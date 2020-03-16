var {diContainer} = require('../diContainer');

module.exports = {
  config: function () {
    diContainer.factory('dbConfig', require('./db'));
    diContainer.factory('dbMultiConfig', require('./db_multi'));
    diContainer.factory('salesDb', require('../gcpDb'));
    diContainer.factory('utils', require('../lib/utilities'));

    diContainer.factory('mySqlConnection', require('../lib/mysql-model2'));
    diContainer.factory('mySqlMultiConnection', require('../lib/mysql-multi'));
    diContainer.factory('fileLoaderSvc', require('../lib/fileLoader'));
    //diContainer.factory('mySqlConnection', require('../db/connection'));

    //MODELS ---->
    diContainer.factory(
      'processDetailsModel',
      require('../models/FileProcessDetails')
    );
    diContainer.factory('processModel', require('../models/FileProcess'));
    // diContainer.factory('salesModel', require('../models/sales'));
    diContainer.factory('db', require('../models'));

    //SERVICES ---->

    diContainer.factory('eventHandler', require('../lib/uploadEventHandler'));

    //CONTROLLERS----->
    diContainer.factory(
      'orderController',
      require('../controllers/orderController')
    );

    diContainer.factory(
      'paymentController',
      require('../controllers/paymentController')
    );

    diContainer.factory(
      'depositController',
      require('../controllers/depositController')
    );

    diContainer.factory(
      'paymentController',
      require('../controllers/paymentController')
    );
    diContainer.factory(
      'adminController',
      require('../controllers/adminController')
    );
    diContainer.factory(
      'authController',
      require('../controllers/authController')
    );
    diContainer.factory(
      'dashboardController',
      require('../controllers/dashboardController')
    );
    diContainer.factory(
      'fileProcessController',
      require('../controllers/fileProcessController')
    );
    diContainer.factory(
      'fileProcessDetailsController',
      require('../controllers/fileProcessDetailsController')
    );

    global.goc = {};
    goc.container = diContainer;
  }
};
