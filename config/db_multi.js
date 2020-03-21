

module.exports = function () {

  var conf = {
    host: process.env.GCP_MYSQL_HOST,
    user: process.env.GCP_MYSQL_USER,
    password: process.env.GCP_MYSQL_PSWD,
    database: process.env.GCP_MYSQL_DB,
    multipleStatements: true,
    port: 3306
  };
  if (
    process.env.INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
  ) {

    conf.socketPath = '/cloudsql/stjohndevsales:us-east1:stjohn-mysql';
    //conf.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    delete conf.port;
  }

  return conf;
};
