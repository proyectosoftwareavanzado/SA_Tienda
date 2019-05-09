'use strict'

const express = require('express');
const routes = express.Router();

const product1 = require('../controllers/productos/getProducto');
const product2 = require('../controllers/productos/insertProducto');
const user = require('../controllers/users/user');

//routes.get('/',user.listUsers);

//routes.get('/', function(req, res, next) {
  //  res.render('index');
//});

routes.get('/',product1.getProductos);

routes.get('/insert',product2.insertProduct);


module.exports = routes;