const express = require('express');

const {
    cadastrarAdministrador,
    cadastrarUsuarioVoluntario,
    login
} = require('../controladores/autenticacaoControlador');

const router = express.Router();

router.post('/administrador', cadastrarAdministrador);
router.post('/voluntario', cadastrarUsuarioVoluntario);
router.post('/login', login);

module.exports = router;