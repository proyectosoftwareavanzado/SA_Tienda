'use strict'

const express = require('express');
const routes = express.Router();

/*************Instancias controladores administrador****************/
//const user = require('../controllers/users/user');
/*******************************************************************/
//router.get('/users',user.listUsers);

routes.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = routes;