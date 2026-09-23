const conexao = require('../banco');

// Relatório de Participação
async function relatorioParticipacao(req, res) {
    try {
        const [relatorio] = await conexao.query(
            `SELECT
                a.id AS assistido_id,
                a.nome AS assistido,
                atv.id AS atividade_id,
                atv.atividade,
                atv.data,
                v.id AS voluntario_id,
                v.nome AS voluntario,
                CASE
                    WHEN p.presenca = 1 THEN 'Presente'
                    ELSE 'Ausente'
                END AS presenca,
                p.observacao
            FROM tbl_participacao p
            INNER JOIN tbl_assistidos a
                ON p.assistido_id = a.id
            INNER JOIN tbl_atividades atv
                ON p.atividade_id = atv.id
            INNER JOIN tbl_voluntarios v
                ON atv.voluntario_id = v.id
            ORDER BY atv.data, a.nome`
        );

        res.json(relatorio);

    } catch (error) {
        console.error(error);
        
        res.status(500).json({ 
            mensagem: 'Erro ao gerar relatório de participação'
        });
    }
}

//Relatório de Assistidos
async function relatorioAssistidos(req, res) {
    try {
        const [relatorio] = await conexao.query(
            `SELECT
                id,
                nome,
                cpf,
                idade,
                escola,
                serie,
                responsavel,
                telefone
            FROM tbl_assistidos
            ORDER BY nome`
        );

        res.json(relatorio);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao gerar relatório de assistidos'
        });
    }
}

//Relatório de Voluntários
async function relatorioVoluntarios(req, res) {
    try {
        const [relatorio] = await conexao.query(
            `SELECT
                id,
                nome,
                cpf,
                email,
                telefone,
                area_atuacao
            FROM tbl_voluntarios
            ORDER BY nome`
        );

        res.json(relatorio);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao gerar relatório de voluntários'
        });
    }
}


async function relatorioAtividades(req, res) {
    try {
        const [relatorio] = await conexao.query(
            `SELECT
                atv.id,
                atv.atividade,
                atv.descricao,
                atv.data,
                v.nome AS voluntario
            FROM tbl_atividades atv
            INNER JOIN tbl_voluntarios v
                ON atv.voluntario_id = v.id
            ORDER BY atv.data, atv.atividade`
        );

        res.json(relatorio);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao gerar relatório de atividades'
        });
    }
}


module.exports = {
    relatorioParticipacao,
    relatorioAssistidos,
    relatorioVoluntarios,
    relatorioAtividades
};