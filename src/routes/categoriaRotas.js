const express = require("express");
const rotas = express();
const { listarCategorias } = require("../controller/categoriaController");
const autenticarUsuario = require("../middleware/autenticacaoMiddleware");

rotas.get("/categoria", autenticarUsuario, listarCategorias);

module.exports = rotas;
