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
        Request.get('http://localhost:8003/enviarOrden', (error, response, body) => {
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
                //console.log(texto);
                const options = {
                    //url: 'http://35.231.130.137:8083/Bodega/obtenerInventario',
                    url: 'http://america.esb5.softwareavanzado.world:8081/Bodega/obtenerInventario',
                    method: 'GET',
                    json: true,
                    headers: {
                        'scope': 'obtenerInventario',
                        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlclByb2R1Y3RvLG9idGVuZXJJbnZlbnRhcmlvLHJlYWxpemFyRGVzcGFjaG8iLCJpYXQiOjE1NTc1OTM3OTUsImV4cCI6MTU1NzU5NzM5NX0.7tcMYegcxTJs2MlH5l34GxSvcuMmMdRcd14G4hzSeac'
                    },
                    body: { arreglo: texto, 
                    destino: "argentina.bodega5.softareavanzado.world:8083", origen: "35.231.130.137" }
                };
                Request(options, (err, response, body) => {
                    console.log(body);
                    var jsonInventarioBodega = body["products"];
                    //console.log("CUERPO INVENTARIO = ");
                    console.log(jsonInventarioBodega);

                    //Verifiicar que hayan productos disponibles
                    console.log("TAM = " + jsonOrdenCliente.length + '-' + jsonInventarioBodega.length);
                    // if (jsonOrdenCliente.length == jsonInventarioBodega.length) {

                    for (let i = 0; i < jsonInventarioBodega.length; i++) {
                        //console.log("Cantidad = " + jsonInventarioBodega[i].inventario + '-' + jsonOrdenCliente[i].cantidad);
                        // if (jsonInventarioBodega[i].inventario >= jsonOrdenCliente[i].cantidad) {
                        var sku = '"' + jsonInventarioBodega[i].sku + '"';
                        console.log(sku);
                        var cantidad = '"' + jsonInventarioBodega[i].inventario + '"';
                        console.log(cantidad);
                        //REALIZAR DESPACHO
                        const options = {
                            //url: 'http://35.231.130.137:8083/Bodega/realizarDespacho',
                            url: 'http://america.esb5.softwareavanzado.world:8081/Bodega/realizarDespacho',
                            method: 'POST',
                            json: true,
                            headers: {
                                'scope': 'realizarDespacho',
                                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6MSwicm9sZXMiOiJvYnRlbmVyQ2F0YWxvZ28sZW5yaXF1ZWNlclByb2R1Y3RvLG9idGVuZXJJbnZlbnRhcmlvLHJlYWxpemFyRGVzcGFjaG8iLCJpYXQiOjE1NTc1OTM3OTUsImV4cCI6MTU1NzU5NzM5NX0.7tcMYegcxTJs2MlH5l34GxSvcuMmMdRcd14G4hzSeac'
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
                            console.log("body"+body);
                            try {
                                conn.query('insert ignore into TIENDA.Orden(periodo, sku, tiempoDespacho, estado)'
                                    + 'values ( 1, "' + jsonInventarioBodega[i].sku + '" , 0, ' + body.resultado + ');',
                                    function (error, results, fields) {
                                        if (error) {
                                            console.log(error);
                                            res.jsonp({ error: 'Error de conexión a la base de datos.' })
                                        }
                                    });
                            } catch (error) {
                                console.log("no funcion :(");
                            }
                            console.log("LLEGO AL FINAL");

                        });
                        //  }
                        //}
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