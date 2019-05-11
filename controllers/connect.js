'use strict'

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '35.225.155.247',//'localhost',
    user     : 'root',
    password : '123',
    database : 'TIENDA'
});

module.exports = {
    connection
}