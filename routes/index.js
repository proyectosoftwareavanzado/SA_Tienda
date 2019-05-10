'use strict'

const express = require('express');
const routes = express.Router();

const product1 = require('../controllers/productos/getProducto');
const product2 = require('../controllers/productos/insertProducto');
const update = require('../controllers/productos/updateProducto');
const clientes = require('../controllers/clientes/getCatalogo');
const clientesOrden = require('../controllers/clientes/setOrden');
const user = require('../controllers/users/user');
const orden = require('../controllers/orden/setOrden');
const carrito = require('../controllers/orden/setCarrito');
const reporte = require('../controllers/reportes/setReporte');
const catalogoBodegas = require('../controllers/bodegas/getCatalogo');

routes.get('/',product1.getProductos);

routes.get('/insert',product2.insertProduct);

//routes.get('/search',search.searchProducto);

routes.post('/carrito',carrito.setCarrito);

routes.get('/realizarOrden',orden.setOrden);

routes.get('/reportes',reporte.setReporte);

routes.get('/catalogo',catalogoBodegas.getCatalogo);

routes.get('/buscar',update.updateProduct);

routes.get('/catalogoClientes',clientes.getCatalogo);

routes.get('/ordenCliente',clientesOrden.setOrden);

module.exports = routes;