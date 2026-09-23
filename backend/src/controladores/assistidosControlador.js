const conexao = require('../banco');

const {
    somenteNumeros,
    validarCPF,
    validarTelefone
} = require('../util/validacao');


// =====================================================
// LISTAR ASSISTIDOS
// =====================================================

async function listarAssistidos(req, res) {
    try {

        const [assistidos] = await conexao.query(
            'SELECT * FROM tbl_assistidos'
        );

        res.json(assistidos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao consultar assistidos.'
        });
    }
}


// =====================================================
// CADASTRAR ASSISTIDO
// =====================================================

async function cadastrarAssistido(req, res) {
    try {

        const {
            nome,
            cpf,
            idade,
            escola,
            serie,
            responsavel,
            telefone
        } = req.body;


        // CAMPOS OBRIGATÓRIOS

        if (
            !nome ||
            !cpf ||
            !idade ||
            !escola ||
            !serie ||
            !responsavel ||
            !telefone
        ) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios.'
            });
        }


        // REMOVE FORMATAÇÃO

        const cpfLimpo = somenteNumeros(cpf);
        const telefoneLimpo = somenteNumeros(telefone);


        // VALIDA CPF

        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({
                mensagem: 'CPF inválido!'
            });
        }


        // VALIDA TELEFONE

        if (!validarTelefone(telefoneLimpo)) {
            return res.status(400).json({
                mensagem: 'Telefone inválido!'
            });
        }


        // VALIDA IDADE

        if (idade < 7 || idade > 17) {
            return res.status(400).json({
                mensagem: 'A idade deve estar entre 7 e 17 anos.'
            });
        }


        // CADASTRA

        const [resultado] = await conexao.query(
            `INSERT INTO tbl_assistidos
            (nome, cpf, idade, escola, serie, responsavel, telefone)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                cpfLimpo,
                idade,
                escola,
                serie,
                responsavel,
                telefoneLimpo
            ]
        );


        res.status(201).json({
            mensagem: 'Assistido cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (error) {

        console.error(error);


        // CPF DUPLICADO

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'CPF já cadastrado.'
            });
        }


        res.status(500).json({
            mensagem: 'Erro ao cadastrar assistido.'
        });
    }
}


// =====================================================
// EDITAR ASSISTIDO
// =====================================================

async function editarAssistido(req, res) {
    try {

        const { id } = req.params;

        const {
            nome,
            cpf,
            idade,
            escola,
            serie,
            responsavel,
            telefone
        } = req.body;


        // CAMPOS OBRIGATÓRIOS

        if (
            !nome ||
            !cpf ||
            !idade ||
            !escola ||
            !serie ||
            !responsavel ||
            !telefone
        ) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios.'
            });
        }


        // REMOVE FORMATAÇÃO

        const cpfLimpo = somenteNumeros(cpf);
        const telefoneLimpo = somenteNumeros(telefone);


        // VALIDA CPF

        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({
                mensagem: 'CPF inválido!'
            });
        }


        // VALIDA TELEFONE

        if (!validarTelefone(telefoneLimpo)) {
            return res.status(400).json({
                mensagem: 'Telefone inválido!'
            });
        }


        // VALIDA IDADE

        if (idade < 7 || idade > 17) {
            return res.status(400).json({
                mensagem: 'A idade deve estar entre 7 e 17 anos.'
            });
        }


        // ATUALIZA

        const [resultado] = await conexao.query(
            `UPDATE tbl_assistidos
            SET
                nome = ?,
                cpf = ?,
                idade = ?,
                escola = ?,
                serie = ?,
                responsavel = ?,
                telefone = ?
            WHERE id = ?`,
            [
                nome,
                cpfLimpo,
                idade,
                escola,
                serie,
                responsavel,
                telefoneLimpo,
                id
            ]
        );


        // ASSISTIDO NÃO ENCONTRADO

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Assistido não encontrado.'
            });
        }


        res.json({
            mensagem: 'Assistido atualizado com sucesso!'
        });

    } catch (error) {

        console.error(error);


        // CPF DUPLICADO

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'CPF já cadastrado.'
            });
        }


        res.status(500).json({
            mensagem: 'Erro ao atualizar assistido.'
        });
    }
}


// =====================================================
// EXCLUIR ASSISTIDO
// =====================================================

async function excluirAssistido(req, res) {
    try {

        const { id } = req.params;


        const [resultado] = await conexao.query(
            'DELETE FROM tbl_assistidos WHERE id = ?',
            [id]
        );


        // ASSISTIDO NÃO ENCONTRADO

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Assistido não encontrado.'
            });
        }


        res.json({
            mensagem: 'Assistido excluído com sucesso!'
        });

    } catch (error) {

        console.error(error);


        // ASSISTIDO POSSUI PARTICIPAÇÕES

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensagem:
                    'Não é possível excluir o assistido, pois existem participações vinculadas a ele.'
            });
        }


        res.status(500).json({
            mensagem: 'Erro ao excluir assistido.'
        });
    }
}


// =====================================================
// EXPORTAÇÕES
// =====================================================

module.exports = {
    listarAssistidos,
    cadastrarAssistido,
    editarAssistido,
    excluirAssistido
};