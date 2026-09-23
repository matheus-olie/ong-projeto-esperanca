const conexao = require('../banco');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cadastrar ADM
async function cadastrarAdministrador(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Email e senha são obrigatórios.'
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await conexao.query(
      `INSERT INTO tbl_usuarios (voluntario_id, email, senha, perfil) VALUES (?, ?, ?, ?)`,
      [
        null,
        email,
        senhaHash,
        'administrador'
      ]
    );

    res.status(201).json({
      mensagem: 'Administrador cadastrado com sucesso.',
      id: resultado.insertId
    });

  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensagem: 'Email já cadastrado.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao cadastrar administrador.'
    });
  }
}

// Cadastrar Voluntário
async function cadastrarUsuarioVoluntario(req, res) {
    try {
        const {
            voluntario_id,
            email,
            senha
        } = req.body;

        if (!voluntario_id || !email || !senha) {
          return res.status(400).json({
            mensagem: 'Voluntario, e-mail e senha são obrigatórios.'
          });
        }

        const [voluntarios] = await conexao.query(
            'SELECT id, email FROM tbl_voluntarios WHERE id = ?',
            [voluntario_id]
        );

        if (voluntarios.length === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const [resultado] = await conexao.query(
          `INSERT INTO tbl_usuarios (voluntario_id, email, senha, perfil) VALUES (?, ?, ?, ?)`,
          [
            voluntario_id,
            email,
            senhaHash,
            'voluntario'
          ]
        );

        res.status(201).json({
          mensagem: 'Usuário voluntário cadastrado com sucesso.',
          id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'Email já cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário voluntário.'
        });
    }
}

// Login
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
          return res.status(400).json({
            mensagem: 'Email e senha são obrigatórios.'
          });
        }

        const [usuarios] = await conexao.query(
          `SELECT
                id,
                voluntario_id,
                email,
                senha,
                perfil
          FROM tbl_usuarios
          WHERE email = ?`,
          [email]
        );

        if (usuarios.length === 0) {
          return res.status(401).json({
            mensagem: 'Email ou senha inválidos.'
          });
        }

        const usuarioEncontrado = usuarios[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuarioEncontrado.senha
        );

        if (!senhaValida) {
          return res.status(401).json({
            mensagem: 'Email ou senha inválidos.'
          });
        }

        const token = jwt.sign(
            {
                id: usuarioEncontrado.id,
                voluntario_id: usuarioEncontrado.voluntario_id,
                perfil: usuarioEncontrado.perfil
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '8h' 
            }
        );

        res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario:{
                id: usuarioEncontrado.id,
                email: usuarioEncontrado.email,
                perfil: usuarioEncontrado.perfil,
                voluntario_id: usuarioEncontrado.voluntario_id
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao realizar login.'
        });
    }
}

module.exports = {
  cadastrarAdministrador,
  cadastrarUsuarioVoluntario,
  login
};