
module.exports = (mySqlConnection) => {
	return mySqlConnection.extend({
		tableName: 'Orders'
	},{
		OrderAmountsByQuarter: async (year, soldThrough) => {
			
			var params = [year, soldThrough];
			var sql = 'SELECT QuarterOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY QuarterOfYear;';
			const result = await new mySqlConnection().queryOptions(sql, params);
			return JSON.parse(JSON.stringify(result));
		},
		OrderAmountsByMonth: async (year, soldThrough) => {
			var params = [year, soldThrough];
			var sql = 'SELECT MonthOfYear, SUM(OrderTotal) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY MonthOfYear';
			const result = await new mySqlConnection().queryOptions(sql, params);
			return JSON.parse(JSON.stringify(result));

		}
	});
};