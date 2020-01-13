module.exports = mySqlConnection => {
  return mySqlConnection.extend(
    {
      tableName: "Orders"
    },
    {
      OrderAmountsByQuarter: async (year, soldThrough) => {
        var params = [soldThrough];
        var sql =
          "SELECT QuarterOfYear, SUM(OrderNet - ShippingDiscount) as Amount FROM Orders WHERE SaleDate >= DATE_SUB( NOW(), INTERVAL 1 YEAR ) AND SoldThrough = ? GROUP BY QuarterOfYear, SaleYear ORDER BY SaleYear, QuarterOfYear;";
        const result = await new mySqlConnection().queryOptions(sql, params);
        return JSON.parse(JSON.stringify(result));
      },
      OrderAmountsByMonth: async (year, soldThrough) => {
        var params = [soldThrough];
        var sql =
          "SELECT MonthOfYear, SUM(OrderNet - ShippingDiscount) as Amount FROM Orders WHERE SaleDate >= DATE_SUB( NOW(), INTERVAL 1 YEAR) AND SoldThrough = ? GROUP BY MonthOfYear, SaleYear ORDER BY SaleYear, MonthOfYear;";

        // "SELECT MonthOfYear, SUM(OrderTotal - ShippingDiscount) as Amount FROM Orders WHERE SaleYear = ? AND SoldThrough = ? GROUP BY MonthOfYear";
        const result = await new mySqlConnection().queryOptions(sql, params);
        return JSON.parse(JSON.stringify(result));
      },
      OrderTotalsByMonth: async year => {
        var params = [year];
        var sql =
          "SELECT MonthOfYear, SUM(OrderTotal - ShippingDiscount) as Amount FROM Orders WHERE SaleDate >= DATE_SUB(NOW(), INTERVAL 1 YEAR) GROUP BY MonthOfYear, SaleYear ORDER BY SaleYear, MonthOfYear;";
        const result = await new mySqlConnection().queryOptions(sql, params);
        return JSON.parse(JSON.stringify(result));
      }
    }
  );
};

