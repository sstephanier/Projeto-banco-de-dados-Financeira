const express = require("express");
const rotas = express();
const {
  cadastrarUsuario,
  atualizarUsuario,
  perfilUsuario,
} = require("../controller/usuarioController");
const autenticarUsuario = require("../middleware/autenticacaoMiddleware");
const {
  validarCadastroAtualizacao,
} = require("../middleware/validarDadosMiddleware");

rotas.post("usuarios/", validarCadastroAtualizacao, cadastrarUsuario);
rotas.get("/usuarios", autenticarUsuario, perfilUsuario);
rotas.put(
  "/usuarios",
  autenticarUsuario,
  validarCadastroAtualizacao,
  atualizarUsuario
);

module.exports = rotas;
