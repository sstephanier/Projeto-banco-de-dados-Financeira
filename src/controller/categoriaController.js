const pool = require("../conexao");

const listarCategorias = async (req, res) => {
  try {
    const listaCategorias = await pool.query("select * from categorias");
    return res.status(201).json({ categorias: listaCategorias.rows });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  listarCategorias,
};
