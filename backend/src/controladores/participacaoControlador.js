const conexao = require('../banco');

async function listarParticipacoes(req, res) {
    try {
        const [participacoes] = await conexao.query(
            `SELECT p.id,
                p.assistido_id,
                a.nome AS assistido,
                p.atividade_id,
                atv.atividade,
                atv.data,
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
            ORDER BY atv.data, a.nome`
        );

        res.json(participacoes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao consultar as participações.'
        });
    }
}

async function cadastrarParticipacao(req, res) {
    try {
        const {
            assistido_id,
            atividade_id,
            presenca,
            observacao
        } = req.body;

        if (!assistido_id || !atividade_id || presenca === undefined) {

            return res.status(400).json({
                mensagem: 'Assistido, atividade e presença são obrigatórios.'
            });
        }

        const [assistidos] = await conexao.query(
            'SELECT id FROM tbl_assistidos WHERE id = ?',
            [assistido_id]
        );

        if (assistidos.length === 0) {
            return res.status(404).json({
                mensagem: 'Assistido não encontrado.'
            });
        }

        const [atividades] = await conexao.query(
            'SELECT id FROM tbl_atividades WHERE id = ?',
            [atividade_id]
        );

        if (atividades.length === 0) {
            return res.status(404).json({
                mensagem: 'Atividade não encontrada.'
            });
        }

        const [resultado] = await conexao.query(
            'INSERT INTO tbl_participacao (assistido_id, atividade_id, presenca, observacao) VALUES (?, ?, ?, ?)',
            [assistido_id,atividade_id, presenca, observacao || null]
        );

        res.status(201).json({
            mensagem: 'Participação cadastrada com sucesso.',
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar a participação.'
        });
    }
}

async function editarParticipacao(req, res) {
    try {
        const { id } = req.params;

        const {
            assistido_id,
            atividade_id,
            presenca,
            observacao
        } = req.body;

        if(
            assistido_id === undefined ||
            atividade_id === undefined ||
            presenca === undefined
        ) {
            return res.status(400).json({
                mensagem: 'Assistido, atividade e presença são obrigatórios.'
            });
        }

        const [assistidos] = await conexao.query(
            'SELECT id FROM tbl_assistidos WHERE id = ?',
            [assistido_id]
        );

        if (assistidos.length === 0) {
            return res.status(404).json({
                mensagem: 'Assistido não encontrado.'
            });
        }

        const [atividades] = await conexao.query(
            'SELECT id FROM tbl_atividades WHERE id = ?',
            [atividade_id]
        );

        if (atividades.length === 0) {
            return res.status(404).json({
                mensagem: 'Atividade não encontrada.'
            });
        }

        const [resultado] = await conexao.query(
            `UPDATE tbl_participacao SET assistido_id = ?, atividade_id = ?, presenca = ?, observacao = ? WHERE id = ?`,
            [assistido_id, atividade_id, presenca, observacao || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Participação não encontrada.'
            });
        }

        res.json({
            mensagem: 'Participação atualizada com sucesso.'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao atualizar a participação.'
        });
    }
}

async function excluirParticipacao(req, res) {
    try {
        const { id } = req.params;

        const [resultado] = await conexao.query(
            'DELETE FROM tbl_participacao WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Participação não encontrada.'
            });
        }

        res.json({
            mensagem: 'Participação excluída com sucesso.'
        }); 

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao excluir a participação.'
        });
    }
}

module.exports = {
    listarParticipacoes,
    cadastrarParticipacao,
    editarParticipacao,
    excluirParticipacao
};
