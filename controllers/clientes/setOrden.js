'use strict'
const ipCliente = process.env.IP || "localhost:8002/users";
const conn = require('../connect').connection;
var http = require('http');
var Request = require("request");
let jsonOrdenCliente;

async function setOrden(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Obtener la orden del cliente
    try {
        Request.get('http://localhost:8002/Cliente/realizarOrden', (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            jsonOrdenCliente = JSON.parse(body);
            console.log(jsonOrdenCliente);
            //Generar la lista de SKU para obtener el inventario de bodega
            if (jsonOrdenCliente.length >= 1) {
                var texto = "[";
                for (let i = 0; i < jsonOrdenCliente.length - 1; i++) {
                    texto = texto + '"' + jsonOrdenCliente[i].sku + '",';
                }
                texto = texto + '"' + jsonOrdenCliente[jsonOrdenCliente.length - 1].sku + '"] ';

                //Obtener inventario de bodega
                const options = {
                    url: 'http://localhost:8002/Bodega/obtenerInventario',
                    method: 'GET',
                    json: true,
                    body: { arreglo: [texto] }
                };

                Request(options, (err, response, body) => {
                   var jsonInventarioBodega = body;
                    console.log("CUERPO INVENTARIO = " + body)

                    //Verifiicar que hayan productos disponibles
                    if (jsonOrdenCliente.length == jsonInventarioBodega.length) {
                        var textoSKU = "[";
                        var textDespacho = "[";
                        for (let i = 0; i < jsonInventarioBodega.length; i++) {
                            if (jsonInventarioBodega[i].cantidad >= jsonOrdenCliente[i].cantidad) {
                                textoSKU = textoSKU + '"' + jsonInventarioBodega[i].sku + '",';
                                textDespacho = textDespacho + '{"sku": "' + jsonInventarioBodega[i].sku + '",'
                                    + '"cantidad": ' + jsonInventarioBodega[i].cantidad + ','
                                    + '"direccion": "Direccion del cliente", '
                                    + '"pais": "Guatemala"},';
                            }
                        }
                        textoSKU = textoSKU + '"' + jsonInventarioBodega[jsonInventarioBodega.length - 1].sku + '"] ';
                        textDespacho = textDespacho + '"sku": "' + jsonInventarioBodega[jsonInventarioBodega.length - 1].sku + '",'
                            + '"cantidad": ' + jsonInventarioBodega[jsonInventarioBodega.length - 1].cantidad + ','
                            + '"direccion": "Direccion del cliente", '
                            + '"pais": "Guatemala"}]';
                        console.log("TEXTO SKU = " + textoSKU);
                        console.log("DESPACHO = " + textDespacho);
                        //Obtener tiempo de respuesta de los productos a bodega (Sirve para el reporte)
                        /* const options = {
                             url: 'http://localhost:8002/Bodega/obtenerTiempoRespuesta',
                             method: 'GET',
                             json: true,
                             body: { arreglo: [textoSKU] }
                         };
 
                         Request(options, (err, response, body) => {
                             var jsonTiempoRespuesta = body;
                             res.jsonp(jsonTiempoRespuesta);
                         
                             console.log("LLEGO AL FINAL");
                             console.log(jsonTiempoRespuesta);
                         });
                         */

                        //REALIZAR DESPACHO
                        const options = {
                            url: 'http://localhost:8002/Bodega/realizarDespacho',
                            method: 'GET',
                            json: true,
                            body: { arreglo: [textDespacho] }
                        };

                        Request(options, (err, response, body) => {
                            res.jsonp(body);

                            console.log("LLEGO AL FINAL");
                            console.log(body);
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        console.log("* * * * * * * * * * * * * * * * * * * * *");
        console.log("Error al realizar la orden del cliente");
        console.log("* * * * * * * * * * * * * * * * * * * * *");
        res.redirect('/insert')
    }

}

module.exports = {
    setOrden
}