'use strict'

const conn = require('../connect').connection;
var http = require('http');
var Request = require("request");
let jsonProductos;
async function insertProduct(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    Request.get("http://localhost:8002/users", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        jsonProductos = JSON.parse(body);
    });

    try {
        console.log(jsonProductos);
        var categorias = jsonProductos["categorias"];
        var productos = jsonProductos["productos"];
        console.log("*********************************************");
        console.log(productos);

        //INSERTAR CATEGORIAS
        for (let i = 0; i < categorias.length; i++) {
            try {
                await conn.query('insert ignore into Categoria(idCategoria, nombre, idPadre)'
                    + 'values (' + categorias[i].id + ',"' + categorias[i].nombre + '",' + categorias[i].padre + ');',
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
        console.log("Se han insertado las categorias a la TIENDA correctamente");

        //INSERTAR PRODUCTOS 
        for (let i = 0; i < productos.length; i++) {
            try {
                await conn.query('insert ignore into Producto(nombre, SKU, estado)'
                    + 'values ("' + productos[i].nombre + '", "' + productos[i].sku + '",' + productos[i].activo + ');',
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
        console.log("Se han insertado los productos a la TIENDA correctamente");

        //INSERTAR CATEGORIA_PRODUCTO
        for (let i = 0; i < productos.length; i++) {
            for (let j = 0; j < productos[i].categorias.length; j++) {
                try {
                    await conn.query('insert into CategoriaProducto(idProducto, idCategoria)' +
                        'values( (Select idProducto from Producto where sku="' + productos[i].sku + '") ,' + productos[i].categorias[j] + ');',
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
        }
        console.log("Se ha insertado la categoria_producto a la TIENDA correctamente");
                      
    } catch (error) {
        console.log("Error al obtener el servicio desde el PIM")
        console.log("* * * * * * * * * * * * * * * * * * * * *")
        console.log(error)
    }
    res.redirect('/');
}


module.exports = {
    insertProduct
}