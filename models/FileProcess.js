
var mysqlModel = require('../lib/mysql-model');
//Then create a model that will be main one for your application (all others will extend it):
var dbConfig = {
    host: '35.196.170.106',
    user: 'salesadmin',
    password: 'johnnyappleseed3334',
    database : 'sales'
  };
var MyAppModel = mysqlModel.createConnection(dbConfig);

module.exports = MyAppModel.extend({
	tableName: 'FileProcess',
});


