'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/user');
/*******************************************************************/

const api = express.Router();

api.get('/users',user.listUsers);

module.exports = api;