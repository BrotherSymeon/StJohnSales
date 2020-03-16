module.exports = function (mySqlConnection) {
  return mySqlConnection.extend({
    tableName: 'EtsyPayment',
    primaryKey: 'PaymentID',
  });
};

