'use strict'

const conn = require('../connect').connection;
let productos;
let carrito;

async function setReporte(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    /*
    await conn.query('SELECT * FROM TIENDA.Producto;', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].descripcion);
            if (!results[i].precioLista) {
                results[i].precioLista = "No disponible";
            } else if (!results[i].descripcion) {
                results[i].descripcion = "No disponible";
            } else if (!results[i].caracteristicas) {
                results[i].caracteristicas = "No disponible";
            }
        }   
        
    });
*/
    res.render('reportes');

}

module.exports = {
    setReporte
}