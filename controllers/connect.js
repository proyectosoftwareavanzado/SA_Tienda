'use strict'

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'TIENDA'
});

module.exports = {
    connection
}