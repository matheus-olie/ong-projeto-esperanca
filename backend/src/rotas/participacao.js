const express = require('express');

const {
    listarParticipacoes,
    cadastrarParticipacao,
    editarParticipacao,
    excluirParticipacao
} = require('../controladores/participacaoControlador');

const router = express.Router();

router.get('/', listarParticipacoes);

router.post('/', cadastrarParticipacao);

router.put('/:id', editarParticipacao);

router.delete('/:id', excluirParticipacao);

module.exports = router;