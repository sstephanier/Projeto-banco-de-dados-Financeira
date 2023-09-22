const express = require("express");
const rotas = express();
const pool = require("../conexao");
const { erroServidor, errorCampo, naoEncontrado } = require('../errors')

const listarTransacoes = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const transacao = await pool.query(
      "select * from transacoes where usuario_id = $1",
      [usuarioId]
    );

    return res.status(200).json(transacao.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}

const cadastrarTransacoes = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body
  const usuarioId = req.usuario.id

  try {
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({ mensagem: errorCampo })
    }

    const categoriaExistente = await pool.query("select * from categorias where id = $1", [categoria_id])

    if (categoriaExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: naoEncontrado });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
    }

    const novaTransacao = await pool.query(
      "insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [descricao, valor, data, categoria_id, tipo, usuarioId]
    )

    return res.status(201).json(novaTransacao.rows[0])

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}

const detalharTransacao = async (req, res) => {
  const usuarioId = req.usuario.id
  const transacaoId = req.params.id

  try {

    const transacao = await pool.query(
      "select t.*, c.descricao as categoria_nome " +
      "from transacoes t " +
      "inner join categorias c on t.categoria_id = c.id " +
      "where t.id = $1 and t.usuario_id = $2",
      [transacaoId, usuarioId]
    );

    if (transacao.rowCount === 0) {
      return res.status(404).json({ mensagem: naoEncontrado });
    }

    return res.status(200).json(transacao.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}

const atualizarTransacao = async (req, res) => {
  const usuarioId = req.usuario.id;
  const transacaoId = req.params.id;
  const {
    descricao,
    valor,
    data,
    categoria_id,
    tipo
  } = req.body;

  try {

    const transacaoExistente = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [transacaoId, usuarioId]
    );

    if (transacaoExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: naoEncontrado });
    }


    const resultado = await pool.query(
      "update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6",
      [descricao, valor, data, categoria_id, tipo, transacaoId]
    );

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}

const excluirTransacao = async (req, res) => {
  const usuarioId = req.usuario.id;
  const transacaoId = req.params.id;

  try {

    const transacaoExistente = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [transacaoId, usuarioId]
    );

    if (transacaoExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: naoEncontrado });
    }


    await pool.query("delete from transacoes where id = $1", [transacaoId]);

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}

const obterExtrato = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {

    const { rows: entradas } = await pool.query(
      "select sum(valor) as entrada from transacoes where usuario_id = $1 and tipo = 'entrada'",
      [usuarioId]
    )


    const { rows: saidas } = await pool.query(
      "select sum(valor) as saida from transacoes where usuario_id = $1 and tipo = 'saida'",
      [usuarioId]
    )


    const entradaTotal = entradas[0].entrada || 0;
    const saidaTotal = saidas[0].saida || 0;

    return res.status(200).json({ entrada: entradaTotal, saida: saidaTotal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: erroServidor });
  }
}


module.exports = {
  listarTransacoes,
  cadastrarTransacoes,
  detalharTransacao,
  atualizarTransacao,
  excluirTransacao,
  obterExtrato
}


