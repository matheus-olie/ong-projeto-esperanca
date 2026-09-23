import { useEffect, useState } from 'react';

import api from '../servicos/api';

import Modal from '../componentes/Modal';


function Participacao() {

    // USUÁRIO LOGADO
    const usuarioLogado =
        JSON.parse(localStorage.getItem('usuario') || 'null');

    const ehAdministrador =
        usuarioLogado?.perfil === 'administrador';

    const ehVoluntario =
        usuarioLogado?.perfil === 'voluntario';

    const podeRegistrar =
        ehAdministrador || ehVoluntario;

    const [participacoes, setParticipacoes] = useState([]);
    const [assistidos, setAssistidos] = useState([]);
    const [atividades, setAtividades] = useState([]);

    const [assistidoId, setAssistidoId] = useState('');
    const [atividadeId, setAtividadeId] = useState('');
    const [presenca, setPresenca] = useState('');
    const [observacao, setObservacao] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);

    const [modalFormularioAberto, setModalFormularioAberto] =
        useState(false);

    const [modalExclusaoAberto, setModalExclusaoAberto] =
        useState(false);

    const [participacaoParaExcluir, setParticipacaoParaExcluir] =
        useState(null);

    const [pesquisa, setPesquisa] = useState('');


    useEffect(() => {
        carregarDados();
    }, []);


    async function carregarDados() {

        try {

            await Promise.all([
                listarParticipacoes(),
                listarAssistidos(),
                listarAtividades()
            ]);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Erro ao carregar os dados.'
            );
        }
    }


    async function listarParticipacoes() {

        const resposta =
            await api.get('/participacao');

        setParticipacoes(resposta.data);
    }


    async function listarAssistidos() {

        const resposta =
            await api.get('/assistidos');

        setAssistidos(resposta.data);
    }


    async function listarAtividades() {

        const resposta =
            await api.get('/atividades');

        setAtividades(resposta.data);
    }


    function limparFormulario() {

        setAssistidoId('');
        setAtividadeId('');
        setPresenca('');
        setObservacao('');

        setEditandoId(null);
    }


    function abrirCadastro() {

        if (!podeRegistrar) {
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


    async function salvarParticipacao(evento) {

        evento.preventDefault();

        if (!podeRegistrar) {
            return;
        }

        setMensagem('');


        if (!assistidoId) {

            setMensagem(
                'Selecione o assistido.'
            );

            return;
        }


        if (!atividadeId) {

            setMensagem(
                'Selecione a atividade.'
            );

            return;
        }


        if (presenca === '') {

            setMensagem(
                'Informe a presença.'
            );

            return;
        }


        const dadosParticipacao = {

            assistido_id: Number(assistidoId),

            atividade_id: Number(atividadeId),

            presenca: presenca === 'true',

            observacao

        };


        try {

            if (editandoId) {

                // Apenas administrador pode editar.
                if (!ehAdministrador) {
                    return;
                }

                await api.put(
                    `/participacao/${editandoId}`,
                    dadosParticipacao
                );

                await listarParticipacoes();

                fecharModalFormulario();

                setMensagem(
                    'Participação atualizada com sucesso!'
                );

                return;
            }


            await api.post(
                '/participacao',
                dadosParticipacao
            );

            await listarParticipacoes();

            fecharModalFormulario();

            setMensagem(
                'Participação cadastrada com sucesso!'
            );


        } catch (erro) {

            console.error(
                'Erro ao salvar participação:',
                erro
            );


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


    function editarParticipacao(
        participacao
    ) {

        if (!ehAdministrador) {
            return;
        }

        setEditandoId(
            participacao.id
        );

        setAssistidoId(
            participacao.assistido_id
        );

        setAtividadeId(
            participacao.atividade_id
        );

        // O backend do relatório retorna "Presente" ou "Ausente".
        // Convertemos para o valor utilizado pelo select.
        setPresenca(
            participacao.presenca === 'Presente'
                ? 'true'
                : 'false'
        );

        setObservacao(
            participacao.observacao || ''
        );

        setMensagem('');

        setModalFormularioAberto(true);
    }


    function abrirConfirmacaoExclusao(
        participacao
    ) {

        if (!ehAdministrador) {
            return;
        }

        setParticipacaoParaExcluir(
            participacao
        );

        setModalExclusaoAberto(true);
    }


    function fecharConfirmacaoExclusao() {

        setParticipacaoParaExcluir(null);

        setModalExclusaoAberto(false);
    }


    async function excluirParticipacao() {

        if (!ehAdministrador || !participacaoParaExcluir) {
            return;
        }


        try {

            await api.delete(
                `/participacao/${participacaoParaExcluir.id}`
            );

            await listarParticipacoes();

            fecharConfirmacaoExclusao();


        } catch (erro) {

            console.error(erro);


            if (erro?.response?.data?.mensagem) {

                setMensagem(
                    erro.response.data.mensagem
                );

            } else {

                setMensagem(
                    'Erro ao excluir a participação.'
                );
            }
        }
    }


    const participacoesFiltradas =
        participacoes.filter(
            (participacao) => {

                const textoPesquisa =
                    pesquisa.toLowerCase();

                return (

                    participacao.assistido
                        ?.toLowerCase()
                        .includes(textoPesquisa)

                    ||

                    participacao.atividade
                        ?.toLowerCase()
                        .includes(textoPesquisa)

                    ||

                    participacao.presenca
                        ?.toLowerCase()
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
                        placeholder="🔎 Pesquisar por assistido ou atividade..."
                        value={pesquisa}
                        onChange={(evento) =>
                            setPesquisa(
                                evento.target.value
                            )
                        }
                    />

                </div>


                {podeRegistrar && (
                    <button
                        className="botao-cadastrar"
                        onClick={abrirCadastro}
                    >
                        + Registrar participação
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

                            <th>Assistido</th>

                            <th>Atividade</th>

                            <th>Data</th>

                            <th>Presença</th>

                            <th>Observação</th>

                            {ehAdministrador && (
                                <th>Ações</th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {participacoesFiltradas.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={
                                        ehAdministrador
                                            ? 6
                                            : 5
                                    }
                                >

                                    Nenhuma participação encontrada.

                                </td>

                            </tr>

                        ) : (

                            participacoesFiltradas.map(
                                (participacao) => (

                                    <tr
                                        key={
                                            participacao.id
                                        }
                                    >

                                        <td>
                                            {
                                                participacao
                                                    .assistido
                                            }
                                        </td>

                                        <td>
                                            {
                                                participacao
                                                    .atividade
                                            }
                                        </td>

                                        <td>

                                            {new Date(
                                                participacao.data
                                            ).toLocaleDateString(
                                                'pt-BR',
                                                {
                                                    timeZone:
                                                        'UTC'
                                                }
                                            )}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    participacao
                                                        .presenca ===
                                                    'Presente'
                                                        ? 'presenca-presente'
                                                        : 'presenca-ausente'
                                                }
                                            >
                                                {
                                                    participacao
                                                        .presenca
                                                }
                                            </span>

                                        </td>

                                        <td>
                                            {
                                                participacao
                                                    .observacao
                                            }
                                        </td>

                                        {ehAdministrador && (
                                            <td>

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarParticipacao(
                                                            participacao
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            participacao
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


            {/* MODAL */}

            {modalFormularioAberto && podeRegistrar && (

                <Modal
                    titulo={
                        editandoId
                            ? 'Editar Participação'
                            : 'Registrar Participação'
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
                        onSubmit={
                            salvarParticipacao
                        }
                    >


                        {/* ASSISTIDO */}

                        <div className="campo-formulario">

                            <label>
                                Assistido
                            </label>

                            <select
                                value={assistidoId}
                                onChange={(evento) =>
                                    setAssistidoId(
                                        evento.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Selecione...
                                </option>

                                {assistidos.map(
                                    (assistido) => (

                                        <option
                                            key={
                                                assistido.id
                                            }
                                            value={
                                                assistido.id
                                            }
                                        >
                                            {
                                                assistido.nome
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ATIVIDADE */}

                        <div className="campo-formulario">

                            <label>
                                Atividade
                            </label>

                            <select
                                value={atividadeId}
                                onChange={(evento) =>
                                    setAtividadeId(
                                        evento.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Selecione...
                                </option>

                                {atividades.map(
                                    (atividade) => (

                                        <option
                                            key={
                                                atividade.id
                                            }
                                            value={
                                                atividade.id
                                            }
                                        >
                                            {
                                                atividade.atividade
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PRESENÇA */}

                        <div className="campo-formulario">

                            <label>
                                Presença
                            </label>

                            <select
                                value={presenca}
                                onChange={(evento) =>
                                    setPresenca(
                                        evento.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Selecione...
                                </option>

                                <option value="true">
                                    Presente
                                </option>

                                <option value="false">
                                    Ausente
                                </option>

                            </select>

                        </div>


                        {/* OBSERVAÇÃO */}

                        <div className="campo-formulario">

                            <label>
                                Observação
                            </label>

                            <textarea
                                value={observacao}
                                onChange={(evento) =>
                                    setObservacao(
                                        evento.target.value
                                    )
                                }
                                rows="4"
                                placeholder="Observações sobre a participação..."
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
                                    : 'Registrar'}
                            </button>

                        </div>

                    </form>

                </Modal>
            )}


            {/* EXCLUSÃO */}

            {modalExclusaoAberto &&
                ehAdministrador &&
                participacaoParaExcluir && (

                    <Modal
                        titulo="Confirmar exclusão"
                        aoFechar={
                            fecharConfirmacaoExclusao
                        }
                    >

                        <div className="confirmacao-exclusao">

                            <p>
                                Deseja realmente excluir
                                este registro de participação?
                            </p>

                            <strong>
                                {
                                    participacaoParaExcluir
                                        .assistido
                                }
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
                                        excluirParticipacao
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


export default Participacao;
