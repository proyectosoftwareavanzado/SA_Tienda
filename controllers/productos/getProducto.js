'use strict'

const conn = require('../connect').connection;

async function getProductos(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    await conn.query('SELECT * FROM TIENDA.Producto;', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].precioLista)
            if (typeof results[i].precioLista === undefined) {
                console.log("entra");
                results[i].precioLista == "-";
            } else if (results[i].descripcion == isNaN) {
                results[i].precioLista == "-";
            } else if (results[i].caracteristicas === null) {
                results[i].precioLista == "-";
            }
        }
        res.render('index', { products: results });
    });


}

module.exports = {
    getProductos
}