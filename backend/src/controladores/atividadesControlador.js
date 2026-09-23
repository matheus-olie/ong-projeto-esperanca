const conexao = require('../banco');

async function listarAtividades(req, res) {
    try {
        const [atividades] = await conexao.query(
            `SELECT
                a.id,
                a.atividade,
                a.descricao,
                a.data,
                a.voluntario_id,
                v.nome AS voluntario
            FROM tbl_atividades a
            INNER JOIN tbl_voluntarios v
                ON a.voluntario_id = v.id
            ORDER BY a.data`
        );

        res.json(atividades);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao consultar as atividades.'
        });
    }
}


// =====================================================
// CADASTRAR NOVA ATIVIDADE
// SOMENTE ADMINISTRADOR
// =====================================================

async function cadastrarAtividade(req, res) {
    try {

        if (req.usuario.perfil !== 'administrador') {
            return res.status(403).json({
                mensagem: 'Apenas administradores podem cadastrar novas atividades.'
            });
        }

        const {
            atividade,
            descricao,
            data,
            voluntario_id
        } = req.body;

        if (!atividade || !data || !voluntario_id) {
            return res.status(400).json({
                mensagem: 'Atividade, data e voluntário são obrigatórios.'
            });
        }

        const [voluntarios] = await conexao.query(
            'SELECT id FROM tbl_voluntarios WHERE id = ?',
            [voluntario_id]
        );

        if (voluntarios.length === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        const [resultado] = await conexao.query(
            `INSERT INTO tbl_atividades
            (atividade, descricao, data, voluntario_id)
            VALUES (?, ?, ?, ?)`,
            [
                atividade,
                descricao || null,
                data,
                voluntario_id
            ]
        );

        res.status(201).json({
            mensagem: 'Atividade cadastrada com sucesso.',
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar a atividade.'
        });
    }
}


// =====================================================
// CADASTRAR NOVA OCORRÊNCIA
// ADMINISTRADOR OU VOLUNTÁRIO
// =====================================================

async function cadastrarOcorrencia(req, res) {
    try {

        const {
            atividade_id,
            data,
            voluntario_id
        } = req.body;

        if (!atividade_id || !data) {
            return res.status(400).json({
                mensagem: 'Atividade e data são obrigatórios.'
            });
        }

        // Busca uma ocorrência existente para usar
        // como base da nova ocorrência
        const [atividades] = await conexao.query(
            `SELECT
                id,
                atividade,
                descricao
            FROM tbl_atividades
            WHERE id = ?`,
            [atividade_id]
        );

        if (atividades.length === 0) {
            return res.status(404).json({
                mensagem: 'Atividade não encontrada.'
            });
        }

        const atividadeBase = atividades[0];

        let voluntarioResponsavel;

        // ADMINISTRADOR
        if (req.usuario.perfil === 'administrador') {

            if (!voluntario_id) {
                return res.status(400).json({
                    mensagem: 'O voluntário responsável é obrigatório.'
                });
            }

            voluntarioResponsavel = Number(voluntario_id);
        }

        // VOLUNTÁRIO
        else if (req.usuario.perfil === 'voluntario') {

            if (!req.usuario.voluntario_id) {
                return res.status(403).json({
                    mensagem: 'O usuário voluntário não possui um voluntário vinculado.'
                });
            }

            // O voluntário não pode escolher outro.
            // O backend utiliza o voluntário do token.
            voluntarioResponsavel =
                Number(req.usuario.voluntario_id);
        }

        // OUTRO PERFIL
        else {
            return res.status(403).json({
                mensagem: 'Perfil de usuário não autorizado.'
            });
        }

        // Confirma que o voluntário responsável existe
        const [voluntarios] = await conexao.query(
            'SELECT id FROM tbl_voluntarios WHERE id = ?',
            [voluntarioResponsavel]
        );

        if (voluntarios.length === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        // Cria a nova ocorrência mantendo
        // o nome e a descrição da atividade base
        const [resultado] = await conexao.query(
            `INSERT INTO tbl_atividades
            (atividade, descricao, data, voluntario_id)
            VALUES (?, ?, ?, ?)`,
            [
                atividadeBase.atividade,
                atividadeBase.descricao,
                data,
                voluntarioResponsavel
            ]
        );

        res.status(201).json({
            mensagem: 'Nova ocorrência cadastrada com sucesso.',
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar a ocorrência.'
        });
    }
}


// =====================================================
// EDITAR ATIVIDADE
// SOMENTE ADMINISTRADOR
// =====================================================

async function editarAtividade(req, res) {
    try {

        if (req.usuario.perfil !== 'administrador') {
            return res.status(403).json({
                mensagem: 'Apenas administradores podem editar atividades.'
            });
        }

        const { id } = req.params;

        const {
            atividade,
            descricao,
            data,
            voluntario_id
        } = req.body;

        if (!atividade || !data || !voluntario_id) {
            return res.status(400).json({
                mensagem: 'Atividade, data e voluntário são obrigatórios.'
            });
        }

        const [voluntarios] = await conexao.query(
            'SELECT id FROM tbl_voluntarios WHERE id = ?',
            [voluntario_id]
        );

        if (voluntarios.length === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        const [resultado] = await conexao.query(
            `UPDATE tbl_atividades
            SET atividade = ?,
                descricao = ?,
                data = ?,
                voluntario_id = ?
            WHERE id = ?`,
            [
                atividade,
                descricao || null,
                data,
                voluntario_id,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Atividade não encontrada.'
            });
        }

        res.json({
            mensagem: 'Atividade atualizada com sucesso.'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao atualizar a atividade.'
        });
    }
}


// =====================================================
// EXCLUIR ATIVIDADE
// SOMENTE ADMINISTRADOR
// =====================================================

async function excluirAtividade(req, res) {
    try {

        if (req.usuario.perfil !== 'administrador') {
            return res.status(403).json({
                mensagem: 'Apenas administradores podem excluir atividades.'
            });
        }

        const { id } = req.params;

        const [resultado] = await conexao.query(
            'DELETE FROM tbl_atividades WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Atividade não encontrada.'
            });
        }

        res.json({
            mensagem: 'Atividade excluída com sucesso.'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensagem: 'Não é possível excluir a atividade porque existem participações vinculadas a ela.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao excluir a atividade.'
        });
    }
}


module.exports = {
    listarAtividades,
    cadastrarAtividade,
    cadastrarOcorrencia,
    editarAtividade,
    excluirAtividade
};