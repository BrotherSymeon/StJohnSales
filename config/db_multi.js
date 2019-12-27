

module.exports = function(){

  var conf =   {
    host: process.env.GCP_MYSQL_HOST,
    user: process.env.GCP_MYSQL_USER,
    password: process.env.GCP_MYSQL_PSWD,
    database : process.env.GCP_MYSQL_DB,
    multipleStatements : true,
    port: 3306
  };
  console.log(conf);
  return conf;
};
