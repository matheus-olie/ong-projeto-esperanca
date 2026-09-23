const express = require('express');

const {
    relatorioParticipacao,
    relatorioAssistidos,
    relatorioVoluntarios,
    relatorioAtividades
} = require('../controladores/relatoriosControlador');

const router = express.Router();

router.get('/participacao', relatorioParticipacao);
router.get('/assistidos', relatorioAssistidos);
router.get('/voluntarios', relatorioVoluntarios);
router.get('/atividades', relatorioAtividades);

module.exports = router;