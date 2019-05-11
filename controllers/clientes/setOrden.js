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
                var texto = [];
                for (let i = 0; i < jsonOrdenCliente.length; i++) {
                    texto[i] = jsonOrdenCliente[i].sku;
                }
                //Obtener inventario de bodega
                //console.log("TEXTO = " + texto);
                const options = {
                    url: 'http://35.231.130.137:8083/Bodega/obtenerInventario',
                    method: 'GET',
                    json: true,
                    headers: {
                        'scope': 'obtenerInventario',
                        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlclByb2R1Y3RvLG9idGVuZXJJbnZlbnRhcmlvLHJlYWxpemFyRGVzcGFjaG8iLCJpYXQiOjE1NTc1Njg4NjUsImV4cCI6MTU1NzU3MjQ2NX0.YAHxBK8P2ESOoiPkgewFdeJ2GSq-qqYAuGbZaMqkcZw'
                    },
                    body: { arreglo: texto, destino: "35.231.130.137", origen: "35.231.130.137" }
                };

                Request(options, (err, response, body) => {
                    var jsonInventarioBodega = body["products"];
                    console.log("CUERPO INVENTARIO = ");
                    console.log(jsonInventarioBodega);

                    //Verifiicar que hayan productos disponibles
                    console.log("TAM = " + jsonOrdenCliente.length + '-' + jsonInventarioBodega.length);
                    if (jsonOrdenCliente.length == jsonInventarioBodega.length) {

                        for (let i = 0; i < jsonInventarioBodega.length; i++) {
                            console.log("Cantidad = " + jsonInventarioBodega[i].inventario + '-' + jsonOrdenCliente[i].cantidad);
                            if (jsonInventarioBodega[i].inventario >= jsonOrdenCliente[i].cantidad) {
                                var sku = '"' + jsonOrdenCliente[i].sku + '"';
                                var cantidad = '"' + jsonOrdenCliente[i].cantidad + '"';
                                //REALIZAR DESPACHO
                                const options = {
                                    url: 'http://35.231.130.137:8083/Bodega/realizarDespacho',
                                    method: 'POST',
                                    json: true,
                                    headers: {
                                        'scope': 'realizarDespacho',
                                        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlclByb2R1Y3RvLG9idGVuZXJJbnZlbnRhcmlvLHJlYWxpemFyRGVzcGFjaG8iLCJpYXQiOjE1NTc1Njg4NjUsImV4cCI6MTU1NzU3MjQ2NX0.YAHxBK8P2ESOoiPkgewFdeJ2GSq-qqYAuGbZaMqkcZw'
                                    },
                                    body: {
                                        sku: sku, cantidad: cantidad, direccion: "Direccion del cliente", pais: "Guatemala"
                                    }
                                };

                                Request(options, (err, response, body) => {
                                    console.log("entro");
                                    if (err) {
                                        console.log(err);
                                    }
                                    res.jsonp(body);

                                    console.log("LLEGO AL FINAL");
                                    console.log(body);
                                });
                            }
                        }
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