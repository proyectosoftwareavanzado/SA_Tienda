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
            var texto = [];
            for (let i = 0; i < results.length; i++) {
                texto[i] = results[i].sku;
            }
            console.log(texto);

            const options = {
                //url: 'http://35.231.130.137:8081/PIM/enriquecerProducto',
                url: 'http://america.esb5.softwareavanzado.world:8081/PIM/enriquecerProducto',
                method: 'GET',
                json: true,
                headers: {
                    'scope': 'enriquecerProducto',
                    'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlclByb2R1Y3RvLG9idGVuZXJJbnZlbnRhcmlvLHJlYWxpemFyRGVzcGFjaG8iLCJpYXQiOjE1NTc1OTM3OTUsImV4cCI6MTU1NzU5NzM5NX0.7tcMYegcxTJs2MlH5l34GxSvcuMmMdRcd14G4hzSeac'
                },
                body: { arreglo: texto }
            };
            Request(options, (err, response, body) => {
                console.log(body);
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