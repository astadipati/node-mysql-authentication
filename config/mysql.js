var mysql      = require('mysql');

var DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'toor',
	'database': 'test'
};

var connection = mysql.createConnection(DB_CONFIG);
connection.connect(function(err) {
  if (err) {
    console.error('DB Connection Failed!\n' + err.stack);
    return;
  }
  console.log('DB Connected!');
});

module.exports = connection;
