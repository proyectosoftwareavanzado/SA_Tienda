'use strict'

const conn = require('../connect').connection;

async function setCarrito(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var idProducto = req.body.BotonCarrito;
    console.log(req.body);
    await conn.query('insert into TIENDA.Carrito(idProducto) '
        + 'values (' + idProducto + ');', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.jsonp({ error: 'Error de conexión a la base de datos.' })
            }
        });

    res.redirect('/');
}

module.exports = {
    setCarrito
}