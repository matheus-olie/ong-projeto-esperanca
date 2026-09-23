const conexao = require('../banco');

const {
    somenteNumeros,
    validarCPF,
    validarTelefone,
    validarEmail
} = require('../util/validacao');

async function listarVoluntarios(req, res) {
    try {
        const [voluntarios] = await conexao.query(
            'SELECT * FROM tbl_voluntarios'
        );

        res.json(voluntarios);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao consultar os voluntários.'
        });
    }
}

async function cadastrarVoluntario(req, res) {
    try{
        const {
            nome,
            cpf,
            email,
            telefone,
            area_atuacao
        } = req.body;

        const cpfLimpo = somenteNumeros(cpf);
        const telefoneLimpo = somenteNumeros(telefone);

        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({
                mensagem: 'CPF inválido.'
            });
        }

        if (!validarTelefone(telefoneLimpo)) {
            return res.status(400).json({
                mensagem: 'Telefone inválido.'
            });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({
                mensagem: 'E-mail inválido.'
            });
        }

        if (!nome || !cpf || !email || !telefone || !area_atuacao) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios.'
            });
        }

        const [resultado] = await conexao.query(
            'INSERT INTO tbl_voluntarios (nome, cpf, email, telefone, area_atuacao) VALUES (?, ?, ?, ?, ?)',
            [nome, cpfLimpo, email, telefoneLimpo, area_atuacao]
        );

        res.status(201).json({
            mensagem: 'Voluntário cadastrado com sucesso!',
            id: resultado.insertId
        });
    
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensagem: 'CPF já cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar o voluntário.'
        });
    }
}

async function editarVoluntario(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            cpf,
            email,
            telefone,
            area_atuacao
        } = req.body;

        const cpfLimpo = somenteNumeros(cpf);
        const telefoneLimpo = somenteNumeros(telefone);

        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({
                mensagem: 'CPF inválido.'
            });
        }

        if (!validarTelefone(telefoneLimpo)) {
            return res.status(400).json({
                mensagem: 'Telefone inválido.'
            });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({
                mensagem: 'E-mail inválido.'
            });
        }

        if (!nome || !cpf || !email || !telefone || !area_atuacao) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios.'
            });
        }

        const [resultado] = await conexao.query(
            'UPDATE tbl_voluntarios SET nome = ?, cpf = ?, email = ?, telefone = ?, area_atuacao = ? WHERE id = ?',
            [nome, cpfLimpo, email, telefoneLimpo, area_atuacao, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        res.json({
            mensagem: 'Voluntário atualizado com sucesso!'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao atualizar o voluntário.'
        });
    }
}

async function excluirVoluntario(req, res) {
    try {
        const { id } = req.params;

        const [resultado] = await conexao.query(
            'DELETE FROM tbl_voluntarios WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Voluntário não encontrado.'
            });
        }

        res.json({
            mensagem: 'Voluntário excluído com sucesso!'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                mensagem: 'Não é possível excluir o voluntário, pois existem atividades vinculadas a ele.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao excluir o voluntário.'
        });
    }
}

module.exports = {
    listarVoluntarios,
    cadastrarVoluntario,
    editarVoluntario,
    excluirVoluntario
};