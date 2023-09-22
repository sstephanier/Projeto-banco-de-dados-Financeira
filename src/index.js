const express = require("express");
const app = express();
const porta = 3000;
const url = `http://localhost:${porta}`;
const usuarioRotas = require('./routes/usuarioRotas')
const loginRotas = require('./routes/loginRotas')
const categoriaRotas = require('./routes/categoriaRotas')
const trasacaoRotas = require('./routes/transacaoRotas')

app.use(express.json());
app.use(usuarioRotas, loginRotas, categoriaRotas, trasacaoRotas);
app.listen(porta, () => {
  console.log(`O servidor está rodando em ${url}`);
});