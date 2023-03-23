const mysql = require("mysql")

var connection = mysql.createPool({
    host: 'localhost',
    user: 'tanawin2',
    password: '1234',
    database: 'vacCenter'
}
)

module.exports = connection;