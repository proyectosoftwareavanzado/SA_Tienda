'use strict'

const conn = require('../connect').connection;

async function setOrden(req, res) {
    console.log("Estoy en orden");

  //res.render('orden', { products: results });
}

module.exports = {
    setOrden
}