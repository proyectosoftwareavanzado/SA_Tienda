'use strict'

const express = require('express');
const routes = express.Router();

const product1 = require('../controllers/productos/getProducto');
const product2 = require('../controllers/productos/insertProducto');
const user = require('../controllers/users/user');
const orden = require('../controllers/orden/setOrden');
const carrito = require('../controllers/orden/setCarrito');
const reporte = require('../controllers/reportes/setReporte');

routes.get('/',product1.getProductos);

routes.get('/insert',product2.insertProduct);

routes.post('/carrito',carrito.setCarrito);

routes.get('/realizarOrden',orden.setOrden);

routes.get('/reportes',reporte.setReporte);


module.exports = routes;