const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt");
const { emailExiste, erroServidor } = require("../errors");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await pool.query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
      [nome, email, senhaCriptografada]
    );

    const { senha: _, ...usuario } = novoUsuario.rows[0];
    return res.status(201).json(usuario);
  } catch (error) {
    if (
      error.message ===
      'duplicate key value violates unique constraint "usuarios_email_key"'
    ) {
      return res.status(400).json({
        mensagem: emailExiste,
      });
    }
    return res.status(500).json({ mensagem: erroServidor });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const id = req.usuario.id;

  try {

    const { rowCount } = await pool.query(
      "select * from usuarios where id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(401).json({ mensagem: naoAutorizado });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryAtualizaUsuario =
      "update usuarios set nome = $1, email = $2, senha = $3 where id = $4";

    await pool.query(queryAtualizaUsuario, [
      nome,
      email,
      senhaCriptografada,
      id,
    ]);

    return res.status(201).json({ messagem: "Usuário atualizado!" });
  } catch (error) {
    console.log(error.message);
    if (
      error.message ===
      'duplicate key value violates unique constraint "usuarios_email_key"'
    ) {
      return res.status(400).json({
        mensagem: emailExiste,
      });
    }
    return res.status(500).json({ mensagem: erroServidor });
  }
};

const perfilUsuario = async (req, res) => {
  try {
    return res.status(201).json(req.usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: erroServidor });
  }
};

module.exports = {
  cadastrarUsuario,
  atualizarUsuario,
  perfilUsuario,
};
