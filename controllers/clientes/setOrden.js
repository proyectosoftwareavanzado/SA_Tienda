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
        Request.get('http://localhost:8002/users', (error, response, body) => {
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
                console.log("LINK HACIA BODEGA = localhost:8002/enriquecerProducto/" + texto);
                Request.get('http://localhost:8002/enriquecerProducto/' + texto, (error, response, body) => {
                    if (error) {
                        return console.dir(error);
                    }
                    var jsonInventarioBodega = JSON.parse(body);
                    //Verifiicar que hayan productos disponibles

                    if (jsonOrdenCliente.length == jsonInventarioBodega.length) {
                        var textoSKU = "[";
                        for (let i = 0; i < jsonInventarioBodega.length; i++) {
                            if (jsonInventarioBodega[i].cantidad >= jsonOrdenCliente[i].cantidad) {
                                textoSKU = textoSKU + '"' + jsonInventarioBodega[i].sku + '",';
                            }
                            textoSKU = textoSKU + '"' + jsonInventarioBodega[jsonInventarioBodega.length - 1].sku + '"] ';
                        }

                        //Obtener tiempo de respuesta de los productos a bodega
                        Request.get('http://localhost:8002/enriquecerProducto/' + textoSKU, (error, response, body) => {
                            if (error) {
                                return console.dir(error);
                            }
                            var jsonTiempoRespuesta = JSON.parse(body);
                            res.jsonp(jsonTiempoRespuesta);
                            console.log("LLEGO AL FINAL");
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