module.exports = function (mySqlConnection) {
  return mySqlConnection.extend({
    tableName: 'EtsyListing',
    primaryKey: 'ETSYLISTINGID'
  });
};
