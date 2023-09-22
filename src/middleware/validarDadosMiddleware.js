const { existeDado } = require("../utils/validarCampoObrigatorio");

const validarLogin = (req, res, next) => {
  const { email, senha } = req.body;

  if (!existeDado(email) || !existeDado(senha)) {
    return res
      .status(400)
      .json({ message: "É necessário informar e-mail e senha." });
  }
  next();
};

const validarCadastroAtualizacao = (req, res, next) => {
  const { email, senha, nome } = req.body;

  if (!existeDado(email) || !existeDado(senha) || !existeDado(nome)) {
    return res
      .status(400)
      .json({ message: "É necessário preencher todos os campos." });
  }
  next();
};

module.exports = {
  validarLogin,
  validarCadastroAtualizacao
};
