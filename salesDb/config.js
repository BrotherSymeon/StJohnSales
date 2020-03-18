

module.exports = {
  dev: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PSWD,
    database : process.env.MYSQL_DB,
    port: 3306,
    multipleStatements: true
  },
  test:{
    host: '',
    user:'',
    password:'',
    database:'',
    port: 3306
  },
  prod:{
    host:'',
    user:'',
    password:'',
    database:'',
    port: 3306
  }
}
