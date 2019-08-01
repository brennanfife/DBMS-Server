var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'toyuser',
  password: 'werwer456',
  database: 'Where2EatYelp'
})
connection.connect((err) => {
  if (err) throw err;
});
module.exports = connection;