'use strict'

const express = require('express');
const routes = express.Router();

const product1 = require('../controllers/productos/getProducto');
const insert = require('../controllers/productos/insertProducto');
const update = require('../controllers/productos/updateProducto');
const clientesOrden = require('../controllers/clientes/setOrden');
const carrito = require('../controllers/orden/setCarrito');
const reporte = require('../controllers/reportes/verReporte');

routes.get('/',product1.getProductos);

routes.get('/Tienda/guardarCatalogo',insert.insertProduct); //Insertar productos desde el PIM

routes.get('/Tienda/enriquecerTienda',update.updateProduct);//Enriquecer producto desde el PIM

routes.get('/ordenCliente',clientesOrden.setOrden);//Agrega la orden, busca inventario de bodega, 
//tiempo de despacho, entre otras cosas.... 

routes.get('/reportes',reporte.verReporte);

//Otros
routes.post('/carrito',carrito.setCarrito); 

module.exports = routes;