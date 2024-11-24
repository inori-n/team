var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '112.124.65.59',
  port: '3306',
  user: 'cyt',
  password: 'AbjhTs8xMLrZDs4j',
  database: 'cyt'
});
module.exports = connection;