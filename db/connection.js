

module.exports = function(mySqlModel, dbConfig) {
  return mySqlModel.createConnection(dbConfig);
};