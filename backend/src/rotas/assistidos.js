const express = require('express');

const {
    listarAssistidos,
    cadastrarAssistido,
    editarAssistido,
    excluirAssistido
} = require('../controladores/assistidosControlador');

const router = express.Router();

router.get('/', listarAssistidos);

router.post('/', cadastrarAssistido);

router.put('/:id', editarAssistido);

router.delete('/:id', excluirAssistido);

module.exports = router;