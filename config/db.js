

module.exports = function () {

  var conf = {
    host: process.env.GCP_MYSQL_HOST,
    user: process.env.GCP_MYSQL_USER,
    password: process.env.GCP_MYSQL_PSWD,
    database: process.env.GCP_MYSQL_DB,
    port: 3306
  };
  if (
    process.env.INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
  ) {
    conf.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }
  console.log('process.env vars ', process.env);
  console.log(conf);
  return conf;
};
