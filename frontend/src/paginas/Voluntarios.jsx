import { useEffect, useState } from 'react';

import api from '../servicos/api';

import Modal from '../componentes/Modal';

import {
    formatarCPF,
    formatarTelefone,
    validarCPF,
    validarTelefone,
    validarEmail
} from '../servicos/validacoes';


function Voluntarios() {

    // USUÁRIO LOGADO
    const usuarioLogado =
        JSON.parse(localStorage.getItem('usuario') || 'null');

    const ehAdministrador =
        usuarioLogado?.perfil === 'administrador';

    const [voluntarios, setVoluntarios] = useState([]);

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [areaAtuacao, setAreaAtuacao] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);

    const [modalFormularioAberto, setModalFormularioAberto] = useState(false);

    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    const [voluntarioParaExcluir, setVoluntarioParaExcluir] = useState(null);

    const [pesquisa, setPesquisa] = useState('');


    useEffect(() => {
        listarVoluntarios();
    }, []);


    async function listarVoluntarios() {

        try {

            const resposta = await api.get('/voluntarios');

            setVoluntarios(resposta.data);

        } catch (erro) {

            console.error(erro);

            setMensagem('Erro ao carregar os voluntários.');
        }
    }


    function limparFormulario() {

        setNome('');
        setCpf('');
        setEmail('');
        setTelefone('');
        setAreaAtuacao('');

        setEditandoId(null);
    }


    function abrirCadastro() {

        if (!ehAdministrador) {
            return;
        }

        limparFormulario();

        setMensagem('');

        setModalFormularioAberto(true);
    }


    function fecharModalFormulario() {

        setModalFormularioAberto(false);

        limparFormulario();

        setMensagem('');
    }


    async function salvarVoluntario(evento) {

        evento.preventDefault();

        if (!ehAdministrador) {
            return;
        }

        setMensagem('');


        // VALIDA CPF

        if (!validarCPF(cpf)) {

            setMensagem(
                'CPF inválido. Verifique os números informados.'
            );

            return;
        }


        // VALIDA TELEFONE

        if (!validarTelefone(telefone)) {

            setMensagem(
                'Telefone inválido. Informe um telefone brasileiro válido.'
            );

            return;
        }


        // VALIDA E-MAIL

        if (!validarEmail(email)) {

            setMensagem(
                'E-mail inválido. Verifique o endereço informado.'
            );

            return;
        }


        const dadosVoluntario = {

            nome,

            cpf,

            email,

            telefone,

            area_atuacao: areaAtuacao
        };


        try {

            if (editandoId) {

                await api.put(
                    `/voluntarios/${editandoId}`,
                    dadosVoluntario
                );

                await listarVoluntarios();

                fecharModalFormulario();

                setMensagem(
                    'Voluntário atualizado com sucesso!'
                );

                return;
            }


            await api.post(
                '/voluntarios',
                dadosVoluntario
            );

            await listarVoluntarios();

            fecharModalFormulario();

            setMensagem(
                'Voluntário cadastrado com sucesso!'
            );


        } catch (erro) {

            console.error(
                'Erro ao salvar voluntário:',
                erro
            );


            if (erro?.response?.status === 409) {

                setMensagem(
                    erro.response.data.mensagem
                );

                return;
            }


            if (erro?.response?.data?.mensagem) {

                setMensagem(
                    erro.response.data.mensagem
                );

                return;
            }


            setMensagem(
                'Não foi possível comunicar com o servidor.'
            );
        }
    }


    function editarVoluntario(voluntario) {

        if (!ehAdministrador) {
            return;
        }

        setEditandoId(voluntario.id);

        setNome(voluntario.nome);

        setCpf(voluntario.cpf);

        setEmail(voluntario.email);

        setTelefone(voluntario.telefone);

        setAreaAtuacao(voluntario.area_atuacao);

        setMensagem('');

        setModalFormularioAberto(true);
    }


    function abrirConfirmacaoExclusao(voluntario) {

        if (!ehAdministrador) {
            return;
        }

        setVoluntarioParaExcluir(voluntario);

        setModalExclusaoAberto(true);
    }


    function fecharConfirmacaoExclusao() {

        setVoluntarioParaExcluir(null);

        setModalExclusaoAberto(false);
    }


    async function excluirVoluntario() {

        if (!ehAdministrador || !voluntarioParaExcluir) {
            return;
        }


        try {

            await api.delete(
                `/voluntarios/${voluntarioParaExcluir.id}`
            );

            await listarVoluntarios();

            fecharConfirmacaoExclusao();


        } catch (erro) {

            console.error(erro);


            if (erro?.response?.data?.mensagem) {

                setMensagem(
                    erro.response.data.mensagem
                );

            } else {

                setMensagem(
                    'Erro ao excluir o voluntário.'
                );
            }
        }
    }


    const voluntariosFiltrados = voluntarios.filter(
        (voluntario) => {

            const textoPesquisa =
                pesquisa.toLowerCase();

            return (

                voluntario.nome
                    .toLowerCase()
                    .includes(textoPesquisa)

                ||

                voluntario.cpf
                    .includes(pesquisa)

                ||

                voluntario.email
                    .toLowerCase()
                    .includes(textoPesquisa)
            );
        }
    );


    return (

        <div className="pagina">


            {/* BARRA DE AÇÕES */}

            <div className="barra-acoes">

                <div className="campo-pesquisa">

                    <input
                        type="text"
                        placeholder="🔎 Pesquisar por nome, CPF ou e-mail..."
                        value={pesquisa}
                        onChange={(evento) =>
                            setPesquisa(evento.target.value)
                        }
                    />

                </div>


                {ehAdministrador && (
                    <button
                        className="botao-cadastrar"
                        onClick={abrirCadastro}
                    >
                        + Cadastrar voluntário
                    </button>
                )}

            </div>


            {/* MENSAGEM */}

            {mensagem && (

                <p className="mensagem">

                    {mensagem}

                </p>
            )}


            {/* TABELA */}

            <div className="tabela-container">

                <table>

                    <thead>

                        <tr>

                            <th>Nome</th>

                            <th>CPF</th>

                            <th>E-mail</th>

                            <th>Telefone</th>

                            <th>Área de atuação</th>

                            {ehAdministrador && (
                                <th>Ações</th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {voluntariosFiltrados.length === 0 ? (

                            <tr>

                                <td colSpan={ehAdministrador ? 6 : 5}>

                                    Nenhum voluntário encontrado.

                                </td>

                            </tr>

                        ) : (

                            voluntariosFiltrados.map(
                                (voluntario) => (

                                    <tr
                                        key={voluntario.id}
                                    >

                                        <td>
                                            {voluntario.nome}
                                        </td>

                                        <td>
                                            {formatarCPF(
                                                voluntario.cpf
                                            )}
                                        </td>

                                        <td>
                                            {voluntario.email}
                                        </td>

                                        <td>
                                            {formatarTelefone(
                                                voluntario.telefone
                                            )}
                                        </td>

                                        <td>
                                            {voluntario.area_atuacao}
                                        </td>

                                        {ehAdministrador && (
                                            <td>

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarVoluntario(
                                                            voluntario
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            voluntario
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </td>
                                        )}

                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>

            </div>


            {/* MODAL DE CADASTRO / EDIÇÃO */}

            {modalFormularioAberto && ehAdministrador && (

                <Modal
                    titulo={
                        editandoId
                            ? 'Editar Voluntário'
                            : 'Cadastrar Voluntário'
                    }
                    aoFechar={
                        fecharModalFormulario
                    }
                >

                    {mensagem && (

                        <p className="mensagem-modal">

                            {mensagem}

                        </p>
                    )}


                    <form
                        className="formulario"
                        onSubmit={salvarVoluntario}
                    >


                        <div className="campo-formulario">

                            <label>
                                Nome
                            </label>

                            <input
                                type="text"
                                value={nome}
                                onChange={(evento) =>
                                    setNome(
                                        evento.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="linha-formulario">


                            <div className="campo-formulario">

                                <label>
                                    CPF
                                </label>

                                <input
                                    type="text"
                                    value={formatarCPF(cpf)}
                                    onChange={(evento) => {

                                        setCpf(
                                            evento.target.value
                                                .replace(/\D/g, '')
                                        );

                                    }}
                                    inputMode="numeric"
                                    maxLength="14"
                                    placeholder="000.000.000-00"
                                    required
                                />

                            </div>


                            <div className="campo-formulario">

                                <label>
                                    Telefone
                                </label>

                                <input
                                    type="text"
                                    value={formatarTelefone(telefone)}
                                    onChange={(evento) => {

                                        setTelefone(
                                            evento.target.value
                                                .replace(/\D/g, '')
                                        );

                                    }}
                                    inputMode="numeric"
                                    maxLength="15"
                                    placeholder="(00) 00000-0000"
                                    required
                                />

                            </div>

                        </div>


                        <div className="campo-formulario">

                            <label>
                                E-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(evento) =>
                                    setEmail(
                                        evento.target.value
                                    )
                                }
                                placeholder="exemplo@email.com"
                                required
                            />

                        </div>


                        <div className="campo-formulario">

                            <label>
                                Área de atuação
                            </label>

                            <input
                                type="text"
                                value={areaAtuacao}
                                onChange={(evento) =>
                                    setAreaAtuacao(
                                        evento.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="acoes-formulario">


                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={
                                    fecharModalFormulario
                                }
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                className="botao-salvar"
                            >
                                {editandoId
                                    ? 'Salvar alterações'
                                    : 'Cadastrar'}
                            </button>

                        </div>


                    </form>

                </Modal>
            )}


            {/* MODAL DE EXCLUSÃO */}

            {modalExclusaoAberto &&
                ehAdministrador &&
                voluntarioParaExcluir && (

                    <Modal
                        titulo="Confirmar exclusão"
                        aoFechar={
                            fecharConfirmacaoExclusao
                        }
                    >

                        <div className="confirmacao-exclusao">

                            <p>
                                Deseja realmente excluir
                                o voluntário:
                            </p>


                            <strong>
                                {voluntarioParaExcluir.nome}
                            </strong>


                            <div className="acoes-formulario">


                                <button
                                    className="botao-cancelar"
                                    onClick={
                                        fecharConfirmacaoExclusao
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    className="botao-excluir-confirmar"
                                    onClick={
                                        excluirVoluntario
                                    }
                                >
                                    Excluir
                                </button>


                            </div>

                        </div>

                    </Modal>
                )}

        </div>
    );
}


export default Voluntarios;
