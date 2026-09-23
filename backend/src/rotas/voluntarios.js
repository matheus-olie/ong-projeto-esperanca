const express = require('express');

const {
    listarVoluntarios,
    cadastrarVoluntario,
    editarVoluntario,
    excluirVoluntario
} = require('../controladores/voluntariosControlador');

const router = express.Router();

router.get('/', listarVoluntarios);

router.post('/', cadastrarVoluntario);

router.put('/:id', editarVoluntario);

router.delete('/:id', excluirVoluntario);

module.exports = router;