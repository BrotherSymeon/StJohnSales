

module.exports = function(mySqlConnection) {
	return mySqlConnection.extend({
		tableName: 'FileProcess',
	});
};


