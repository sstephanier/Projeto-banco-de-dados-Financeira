const express = require("express");
const rotas = express();
const { listarTransacoes, cadastrarTransacoes, detalharTransacao, atualizarTransacao, excluirTransacao, obterExtrato } = require("../controller/transacaoController");
const autenticarUsuario = require("../middleware/autenticacaoMiddleware")

rotas.get("/transacao", autenticarUsuario, listarTransacoes);
rotas.post("/transacao", autenticarUsuario, cadastrarTransacoes);
rotas.get("/transacao/:id", autenticarUsuario, detalharTransacao);
rotas.put("/transacao/:id", autenticarUsuario, atualizarTransacao);
rotas.delete("/transacao/:id", autenticarUsuario, excluirTransacao);
rotas.get("/transacao/extrato", autenticarUsuario, obterExtrato);

module.exports = rotas;