var mysqlModel = require('../lib/mysql-model');
//Then create a model that will be main one for your application (all others will extend it):
var dbConfig = require('../config/db');

var MyAppModel = mysqlModel.createConnection(dbConfig);

module.exports = MyAppModel.extend({
	tableName: 'FileProcessDetails',
});