const express = require('express');

const {
    listarAtividades,
    cadastrarAtividade,
    cadastrarOcorrencia,
    editarAtividade,
    excluirAtividade
} = require('../controladores/atividadesControlador');

const router = express.Router();

router.get('/', listarAtividades);

router.post('/', cadastrarAtividade);

router.post('/ocorrencia', cadastrarOcorrencia);

router.put('/:id', editarAtividade);

router.delete('/:id', excluirAtividade);

module.exports = router;