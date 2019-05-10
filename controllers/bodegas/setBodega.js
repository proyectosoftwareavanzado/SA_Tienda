'use strict'

const conn = require('../connect').connection;
var http = require('http');
var Request = require("request");
let jsonProductos;

async function setBodega(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    Request.get("http://localhost:8002/users", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        jsonProductos = JSON.parse(body);
         try {
            var productos = jsonProductos["products"];
            console.log(productos);
        } catch (error) {

        }
    });
}

module.exports = {
    setBodega
}