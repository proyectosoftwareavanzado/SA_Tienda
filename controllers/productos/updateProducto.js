'use strict'

const conn = require('../connect').connection;
var http = require('http');
var Request = require("request");
let jsonUpdate;
async function updateProduct(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    await conn.query('Select sku from TIENDA.Producto where proveedor="pim";', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        if (results.length >= 1) {
            var texto = "[";
            for (let i = 0; i < results.length - 1; i++) {
                texto = texto + '"' + results[i].sku + '",';
            }
            texto = texto + '"' + results[results.length - 1].sku + '"] ';
            console.log("ruta/PIM/enriquecerProducto" + texto);

            const options = {
                url: 'http://35.231.130.137:8081/PIM/enriquecerProducto',
                method: 'GET',
                json: true,
                body: { arreglo: [texto] }
            };

            Request(options, (err, response, body) => {
                //console.log(body);
                jsonUpdate = body;
                //ACTUALIZAR PRODUCTO
                for (let i = 0; i < jsonUpdate.length; i++) {
                    try {
                        conn.query('Update TIENDA.Producto '
                            + 'Set nombre = "' + jsonUpdate[i].nombre + '",precioLista = ' + jsonUpdate[i].precio_lista
                            + ', caracteristicas="' + jsonUpdate[i].descripcion_corto + '", descripcion="' + jsonUpdate[i].descripcion_larga + '", estado = ' + jsonUpdate[i].activo
                            + ' where SKU = "' + jsonUpdate[i].sku + '";',
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                    res.jsonp({ error: 'Error de conexión a la base de datos.' })
                                }
                            });
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
            console.log("Se han actualizado los productos en la TIENDA correctamente");
        }
    });
    res.redirect('/');
}

module.exports = {
    updateProduct
}