const express = require("express");
const rotas = express();
const logarUsuario = require("../controller/loginController");
const { validarLogin } = require("../middleware/validarDadosMiddleware");

rotas.post("/login", validarLogin, logarUsuario);

module.exports = rotas;
