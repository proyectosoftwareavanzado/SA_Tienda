'use strict'

const conn = require('../connect').connection;

async function listUsers(req,res){
    await conn.query('SELECT * FROM TIENDA.Producto;', function (error, results, fields) {
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }
        
        res.jsonp(results);
    });
}

module.exports = {
    listUsers
}