
var mysqlModel = require('../lib/mysql-model');
var dbConfig = require('../config/db');
//Then create a model that will be main one for your application (all others will extend it):
var MyAppModel = mysqlModel.createConnection(dbConfig);

module.exports = MyAppModel.extend({
	tableName: 'FileProcess',
});


