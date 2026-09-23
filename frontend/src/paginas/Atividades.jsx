import { useEffect, useState } from 'react';

import api from '../servicos/api';
import Modal from '../componentes/Modal';


function Atividades() {

    const [atividades, setAtividades] = useState([]);
    const [voluntarios, setVoluntarios] = useState([]);

    const [atividade, setAtividade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [voluntarioId, setVoluntarioId] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);

    const [modalFormularioAberto, setModalFormularioAberto] =
        useState(false);

    const [modalExclusaoAberto, setModalExclusaoAberto] =
        useState(false);

    const [modalNovaOcorrencia, setModalNovaOcorrencia] =
        useState(false);

    const [atividadeParaExcluir, setAtividadeParaExcluir] =
        useState(null);

    const [atividadeSelecionada, setAtividadeSelecionada] =
        useState(null);

    const [atividadeBase, setAtividadeBase] =
        useState(null);

    const [dataOcorrencia, setDataOcorrencia] =
        useState('');

    const [voluntarioOcorrencia, setVoluntarioOcorrencia] =
        useState('');

    const [pesquisa, setPesquisa] = useState('');

    const usuarioLogado =
        JSON.parse(localStorage.getItem('usuario') || 'null');

    const ehAdministrador =
        usuarioLogado?.perfil === 'administrador';

    const ehVoluntario =
        usuarioLogado?.perfil === 'voluntario';

    const voluntarioLogado =
        voluntarios.find(
            (voluntario) =>
                Number(voluntario.id) ===
                Number(usuarioLogado?.voluntario_id)
        );


    useEffect(() => {
        carregarDados();
    }, []);


    async function carregarDados() {

        try {

            const [
                respostaAtividades,
                respostaVoluntarios
            ] = await Promise.all([
                api.get('/atividades'),
                api.get('/voluntarios')
            ]);

            setAtividades(respostaAtividades.data);
            setVoluntarios(respostaVoluntarios.data);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Erro ao carregar as atividades.'
            );
        }
    }


    /*
     * FORMATA A DATA SEM USAR new Date("YYYY-MM-DD")
     * PARA EVITAR PROBLEMAS DE FUSO HORÁRIO.
     */

    function formatarData(dataAtividade) {

        if (!dataAtividade) {
            return '';
        }

        const dataTexto =
            String(dataAtividade).substring(0, 10);

        const partes =
            dataTexto.split('-');

        if (partes.length !== 3) {
            return '';
        }

        const [ano, mes, dia] = partes;

        return `${dia}/${mes}/${ano}`;
    }


    /*
     * CONVERTE A DATA PARA COMPARAÇÃO
     */

    function obterDataSemHorario(dataAtividade) {

        if (!dataAtividade) {
            return null;
        }

        const dataTexto =
            String(dataAtividade).substring(0, 10);

        const partes =
            dataTexto.split('-');

        if (partes.length !== 3) {
            return null;
        }

        const [ano, mes, dia] = partes;

        return new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
        );
    }


    /*
     * CLASSIFICA A OCORRÊNCIA
     */

    function classificarOcorrencia(dataAtividade) {

        const dataOcorrencia =
            obterDataSemHorario(dataAtividade);

        if (!dataOcorrencia) {
            return 'proxima';
        }

        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        if (dataOcorrencia < hoje) {
            return 'realizada';
        }

        if (
            dataOcorrencia.getTime() ===
            hoje.getTime()
        ) {
            return 'hoje';
        }

        return 'proxima';
    }


    /*
     * CONVERTE DATA PARA NÚMERO
     * USADO NA ORDENAÇÃO.
     */

    function converterDataParaNumero(dataAtividade) {

        if (!dataAtividade) {
            return 0;
        }

        const dataTexto =
            String(dataAtividade).substring(0, 10);

        return Number(
            dataTexto.replaceAll('-', '')
        );
    }


    /*
     * LIMPA O FORMULÁRIO DE ATIVIDADE
     */

    function limparFormulario() {

        setAtividade('');
        setDescricao('');
        setData('');
        setVoluntarioId('');

        setEditandoId(null);
    }


    /*
     * ABRE CADASTRO DE ATIVIDADE
     */

    function abrirCadastro() {

        limparFormulario();

        setMensagem('');

        setModalFormularioAberto(true);
    }


    /*
     * FECHA FORMULÁRIO
     */

    function fecharModalFormulario() {

        setModalFormularioAberto(false);

        limparFormulario();

        setMensagem('');
    }


    /*
     * SALVA OU EDITA ATIVIDADE
     */

    async function salvarAtividade(evento) {

        evento.preventDefault();

        setMensagem('');

        const dadosAtividade = {

            atividade,

            descricao,

            data,

            voluntario_id:
                Number(voluntarioId)
        };

        try {

            /*
             * EDIÇÃO
             */

            if (editandoId) {

                await api.put(
                    `/atividades/${editandoId}`,
                    dadosAtividade
                );

                await carregarDados();

                fecharModalFormulario();

                setMensagem(
                    'Atividade atualizada com sucesso!'
                );

                return;
            }


            /*
             * NOVO CADASTRO
             */

            await api.post(
                '/atividades',
                dadosAtividade
            );

            await carregarDados();

            fecharModalFormulario();

            setMensagem(
                'Atividade cadastrada com sucesso!'
            );

        } catch (erro) {

            console.error(erro);

            if (
                erro?.response?.data?.mensagem
            ) {

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


    /*
     * EDITAR UMA OCORRÊNCIA
     */

    function editarAtividade(atividadeAtual) {

        setEditandoId(
            atividadeAtual.id
        );

        setAtividade(
            atividadeAtual.atividade
        );

        setDescricao(
            atividadeAtual.descricao || ''
        );

        setData(
            atividadeAtual.data
                ? String(
                    atividadeAtual.data
                ).substring(0, 10)
                : ''
        );

        setVoluntarioId(
            atividadeAtual.voluntario_id
        );

        setMensagem('');

        setModalFormularioAberto(true);
    }


    /*
     * ABRE CONFIRMAÇÃO DE EXCLUSÃO
     */

    function abrirConfirmacaoExclusao(
        atividadeAtual
    ) {

        setAtividadeParaExcluir(
            atividadeAtual
        );

        setModalExclusaoAberto(true);
    }


    /*
     * FECHA CONFIRMAÇÃO
     */

    function fecharConfirmacaoExclusao() {

        setAtividadeParaExcluir(null);

        setModalExclusaoAberto(false);
    }


    /*
     * EXCLUI OCORRÊNCIA
     */

    async function excluirAtividade() {

        if (!atividadeParaExcluir) {
            return;
        }

        try {

            await api.delete(
                `/atividades/${atividadeParaExcluir.id}`
            );

            await carregarDados();

            fecharConfirmacaoExclusao();

            setMensagem(
                'Atividade excluída com sucesso!'
            );

        } catch (erro) {

            console.error(erro);

            if (
                erro?.response?.data?.mensagem
            ) {

                setMensagem(
                    erro.response.data.mensagem
                );

                return;
            }

            setMensagem(
                'Erro ao excluir a atividade.'
            );
        }
    }


    /*
     * ABRE OS DETALHES DA ATIVIDADE
     */

    function abrirAtividade(nomeAtividade) {

        setAtividadeSelecionada(
            nomeAtividade
        );

        setMensagem('');
    }


    /*
     * VOLTA PARA OS CARDS
     */

    function voltarParaAtividades() {

        setAtividadeSelecionada(null);

        setMensagem('');
    }


    /*
     * ABRE CADASTRO DE NOVA OCORRÊNCIA
     *
     * A ocorrência recebe automaticamente
     * o nome e a descrição da atividade.
     */

    function abrirNovaOcorrencia(
        atividadeAtual
    ) {

        setAtividadeBase(
            atividadeAtual
        );

        setDataOcorrencia('');

        if (ehVoluntario) {
            setVoluntarioOcorrencia(
                String(usuarioLogado?.voluntario_id || '')
            );
        } else {
            setVoluntarioOcorrencia('');
        }

        setMensagem('');

        setModalNovaOcorrencia(true);
    }


    /*
     * CADASTRA NOVA OCORRÊNCIA
     */

    async function cadastrarNovaOcorrencia(
        evento
    ) {

        evento.preventDefault();

        setMensagem('');

        if (!dataOcorrencia) {
            setMensagem(
                'Informe a data da ocorrência.'
            );
            return;
        }

        if (
            ehAdministrador &&
            !voluntarioOcorrencia
        ) {
            setMensagem(
                'Informe o voluntário responsável.'
            );
            return;
        }

        if (
            ehVoluntario &&
            !usuarioLogado?.voluntario_id
        ) {
            setMensagem(
                'Não foi possível identificar o voluntário responsável.'
            );
            return;
        }

        try {

            const dadosOcorrencia = {
                atividade_id: atividadeBase.id,
                data: dataOcorrencia
            };

            if (ehAdministrador) {
                dadosOcorrencia.voluntario_id =
                    Number(voluntarioOcorrencia);
            }

            await api.post(
                '/atividades/ocorrencia',
                dadosOcorrencia
            );


            /*
             * FECHA O MODAL
             */

            setModalNovaOcorrencia(false);

            setAtividadeBase(null);

            setDataOcorrencia('');

            setVoluntarioOcorrencia('');

            /*
             * ATUALIZA OS DADOS
             */

            await carregarDados();

            setMensagem(
                'Nova ocorrência cadastrada com sucesso!'
            );

        } catch (erro) {

            console.error(erro);

            setMensagem(
                erro?.response?.data?.mensagem ||
                'Erro ao cadastrar a ocorrência.'
            );
        }
    }


    /*
     * FILTRO DE PESQUISA
     */

    const atividadesFiltradas =
        atividades.filter(
            (atividadeAtual) => {

                const textoPesquisa =
                    pesquisa.toLowerCase();

                return atividadeAtual.atividade
                    ?.toLowerCase()
                    .includes(textoPesquisa);
            }
        );


    /*
     * AGRUPA AS OCORRÊNCIAS
     * PELO NOME DA ATIVIDADE
     */

    const gruposAtividades =
        atividadesFiltradas.reduce(
            (grupos, atividadeAtual) => {

                const nome =
                    atividadeAtual.atividade;

                if (!grupos[nome]) {
                    grupos[nome] = [];
                }

                grupos[nome].push(
                    atividadeAtual
                );

                return grupos;

            },
            {}
        );


    const nomesAtividades =
        Object.keys(
            gruposAtividades
        );


    /*
     * OCORRÊNCIAS DA ATIVIDADE SELECIONADA
     */

    const ocorrencias =
        atividadeSelecionada
            ? (
                gruposAtividades[
                    atividadeSelecionada
                ] ||
                atividades.filter(
                    (item) =>
                        item.atividade ===
                        atividadeSelecionada
                )
            )
            : [];


    /*
     * SEPARA AS OCORRÊNCIAS
     */

    const ocorrenciasRealizadas =
        ocorrencias
            .filter(
                (item) =>
                    classificarOcorrencia(
                        item.data
                    ) === 'realizada'
            )
            .sort(
                (a, b) =>
                    converterDataParaNumero(
                        a.data
                    ) -
                    converterDataParaNumero(
                        b.data
                    )
            );


    const ocorrenciasHoje =
        ocorrencias.filter(
            (item) =>
                classificarOcorrencia(
                    item.data
                ) === 'hoje'
        );


    const ocorrenciasProximas =
        ocorrencias
            .filter(
                (item) =>
                    classificarOcorrencia(
                        item.data
                    ) === 'proxima'
            )
            .sort(
                (a, b) =>
                    converterDataParaNumero(
                        a.data
                    ) -
                    converterDataParaNumero(
                        b.data
                    )
            );


    /*
     * ==================================================
     * TELA DE DETALHES
     * ==================================================
     */

    if (atividadeSelecionada) {

        return (

            <div className="pagina">

                <button
                    className="botao-voltar"
                    onClick={
                        voltarParaAtividades
                    }
                >
                    ← Voltar
                </button>


                <div className="titulo-atividade-detalhes">

                    <h2>
                        {atividadeSelecionada}
                    </h2>

                    <span>
                        {ocorrencias.length}{' '}

                        {ocorrencias.length === 1
                            ? 'ocorrência'
                            : 'ocorrências'}
                    </span>

                </div>


                {mensagem && (
                    <p className="mensagem">
                        {mensagem}
                    </p>
                )}


                {/* =====================================
                    JÁ REALIZADAS
                ===================================== */}

                {ocorrenciasRealizadas.length > 0 && (

                    <section className="secao-ocorrencias">

                        <h3
                            className={
                                'titulo-secao realizada'
                            }
                        >
                            🔴 Já realizadas
                        </h3>


                        <div className="lista-ocorrencias">

                            {ocorrenciasRealizadas.map(
                                (ocorrencia) => (

                                    <div
                                        className={
                                            'card-ocorrencia realizada'
                                        }
                                        key={
                                            ocorrencia.id
                                        }
                                    >

                                        <div className="data-ocorrencia">

                                            {formatarData(
                                                ocorrencia.data
                                            )}

                                        </div>


                                        <div className="dados-ocorrencia">

                                            <h4>
                                                👤{' '}
                                                {
                                                    ocorrencia.voluntario
                                                }
                                            </h4>

                                            <p>
                                                {
                                                    ocorrencia.descricao ||
                                                    'Nenhuma descrição informada.'
                                                }
                                            </p>

                                        </div>


                                        {ehAdministrador && (
                                            <div className="acoes-ocorrencia">

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarAtividade(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =====================================
                    HOJE
                ===================================== */}

                {ocorrenciasHoje.length > 0 && (

                    <section className="secao-ocorrencias">

                        <h3
                            className={
                                'titulo-secao hoje'
                            }
                        >
                            🟢 Hoje
                        </h3>


                        <div className="lista-ocorrencias">

                            {ocorrenciasHoje.map(
                                (ocorrencia) => (

                                    <div
                                        className={
                                            'card-ocorrencia hoje'
                                        }
                                        key={
                                            ocorrencia.id
                                        }
                                    >

                                        <div className="data-ocorrencia">

                                            {formatarData(
                                                ocorrencia.data
                                            )}

                                        </div>


                                        <div className="dados-ocorrencia">

                                            <h4>
                                                👤{' '}
                                                {
                                                    ocorrencia.voluntario
                                                }
                                            </h4>

                                            <p>
                                                {
                                                    ocorrencia.descricao ||
                                                    'Nenhuma descrição informada.'
                                                }
                                            </p>

                                        </div>


                                        {ehAdministrador && (
                                            <div className="acoes-ocorrencia">

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarAtividade(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =====================================
                    PRÓXIMAS
                ===================================== */}

                {ocorrenciasProximas.length > 0 && (

                    <section className="secao-ocorrencias">

                        <h3
                            className={
                                'titulo-secao proxima'
                            }
                        >
                            🔵 Próximas
                        </h3>


                        <div className="lista-ocorrencias">

                            {ocorrenciasProximas.map(
                                (ocorrencia) => (

                                    <div
                                        className={
                                            'card-ocorrencia proxima'
                                        }
                                        key={
                                            ocorrencia.id
                                        }
                                    >

                                        <div className="data-ocorrencia">

                                            {formatarData(
                                                ocorrencia.data
                                            )}

                                        </div>


                                        <div className="dados-ocorrencia">

                                            <h4>
                                                👤{' '}
                                                {
                                                    ocorrencia.voluntario
                                                }
                                            </h4>

                                            <p>
                                                {
                                                    ocorrencia.descricao ||
                                                    'Nenhuma descrição informada.'
                                                }
                                            </p>

                                        </div>


                                        {ehAdministrador && (
                                            <div className="acoes-ocorrencia">

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarAtividade(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            ocorrencia
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {ocorrencias.length === 0 && (

                    <div className="mensagem">
                        Nenhuma ocorrência encontrada.
                    </div>

                )}


                {/* =====================================
                    MODAL EDITAR/CADASTRAR
                ===================================== */}

                {modalFormularioAberto && (

                    <Modal
                        titulo={
                            editandoId
                                ? 'Editar Atividade'
                                : 'Cadastrar Atividade'
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


                        <FormularioAtividade

                            atividade={atividade}

                            setAtividade={
                                setAtividade
                            }

                            descricao={descricao}

                            setDescricao={
                                setDescricao
                            }

                            data={data}

                            setData={setData}

                            voluntarioId={
                                voluntarioId
                            }

                            setVoluntarioId={
                                setVoluntarioId
                            }

                            voluntarios={
                                voluntarios
                            }

                            editandoId={
                                editandoId
                            }

                            aoCancelar={
                                fecharModalFormulario
                            }

                            aoSalvar={
                                salvarAtividade
                            }

                        />

                    </Modal>

                )}


                {/* =====================================
                    MODAL EXCLUSÃO
                ===================================== */}

                {modalExclusaoAberto &&
                    atividadeParaExcluir && (

                    <Modal
                        titulo="Confirmar exclusão"
                        aoFechar={
                            fecharConfirmacaoExclusao
                        }
                    >

                        <div className="confirmacao-exclusao">

                            <p>
                                Deseja realmente excluir
                                esta ocorrência?
                            </p>


                            <strong>
                                {
                                    atividadeParaExcluir
                                        .atividade
                                }
                            </strong>


                            <p>
                                Data:{' '}
                                {formatarData(
                                    atividadeParaExcluir.data
                                )}
                            </p>


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
                                    className={
                                        'botao-excluir-confirmar'
                                    }
                                    onClick={
                                        excluirAtividade
                                    }
                                >
                                    Excluir
                                </button>

                            </div>

                        </div>

                    </Modal>

                )}


                {/* =====================================
                    MODAL NOVA OCORRÊNCIA
                ===================================== */}

                {modalNovaOcorrencia &&
                    atividadeBase && (

                    <Modal
                        titulo={
                            `Nova ocorrência — ` +
                            atividadeBase.atividade
                        }
                        aoFechar={() => {

                            setModalNovaOcorrencia(
                                false
                            );

                            setAtividadeBase(
                                null
                            );

                            setMensagem('');

                        }}
                    >

                        {mensagem && (
                            <p className="mensagem-modal">
                                {mensagem}
                            </p>
                        )}


                        <form
                            className="formulario"
                            onSubmit={
                                cadastrarNovaOcorrencia
                            }
                        >

                            <div className="campo-formulario">

                                <label>
                                    Data da ocorrência
                                </label>

                                <input
                                    type="date"
                                    value={
                                        dataOcorrencia
                                    }
                                    onChange={
                                        (evento) =>
                                            setDataOcorrencia(
                                                evento.target.value
                                            )
                                    }
                                    required
                                />

                            </div>


                            <div className="campo-formulario">

                                <label>
                                    Voluntário responsável
                                </label>

                                <select
                                    value={
                                        voluntarioOcorrencia
                                    }
                                    onChange={
                                        (evento) =>
                                            setVoluntarioOcorrencia(
                                                evento.target.value
                                            )
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecione o voluntário
                                    </option>


                                    {voluntarios.map(
                                        (voluntario) => (

                                            <option
                                                key={
                                                    voluntario.id
                                                }
                                                value={
                                                    voluntario.id
                                                }
                                            >
                                                {
                                                    voluntario.nome
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="acoes-formulario">

                                <button
                                    type="button"
                                    className="botao-cancelar"
                                    onClick={() => {

                                        setModalNovaOcorrencia(
                                            false
                                        );

                                        setAtividadeBase(
                                            null
                                        );

                                        setMensagem('');

                                    }}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="botao-salvar"
                                >
                                    Cadastrar ocorrência
                                </button>

                            </div>

                        </form>

                    </Modal>

                )}

            </div>

        );
    }


    /*
     * ==================================================
     * TELA PRINCIPAL — CARDS
     * ==================================================
     */

    return (

        <div className="pagina">

            <div className="barra-acoes">

                <div className="campo-pesquisa">

                    <input
                        type="text"
                        placeholder="🔎 Pesquisar atividade..."
                        value={pesquisa}
                        onChange={(evento) =>
                            setPesquisa(
                                evento.target.value
                            )
                        }
                    />

                </div>


                {ehAdministrador && (
                    <button
                        className="botao-cadastrar"
                        onClick={abrirCadastro}
                    >
                        + Cadastrar atividade
                    </button>
                )}

            </div>


            {mensagem && (
                <p className="mensagem">
                    {mensagem}
                </p>
            )}


            <div className="grade-atividades">

                {nomesAtividades.length === 0 ? (

                    <div className="mensagem">
                        Nenhuma atividade encontrada.
                    </div>

                ) : (

                    nomesAtividades.map(
                        (nomeAtividade) => {

                            const ocorrenciasDoGrupo =
                                gruposAtividades[
                                    nomeAtividade
                                ];

                            const quantidade =
                                ocorrenciasDoGrupo.length;

                            /*
                             * Pegamos a primeira ocorrência
                             * para reutilizar o nome e
                             * descrição ao criar uma nova.
                             */

                            const atividadeBaseGrupo =
                                ocorrenciasDoGrupo[0];


                            return (

                                <div
                                    className="card-atividade"
                                    key={nomeAtividade}
                                >

                                    {/* ÁREA QUE ABRE OS DETALHES */}

                                    <div
                                        className={
                                            'area-card-atividade'
                                        }
                                        onClick={() =>
                                            abrirAtividade(
                                                nomeAtividade
                                            )
                                        }
                                    >

                                        <div className="icone-atividade">
                                            📅
                                        </div>


                                        <div className="conteudo-card-atividade">

                                            <h3>
                                                {
                                                    nomeAtividade
                                                }
                                            </h3>


                                            <p className="quantidade-ocorrencias">

                                                {quantidade}{' '}

                                                {quantidade === 1
                                                    ? 'ocorrência'
                                                    : 'ocorrências'}

                                            </p>

                                        </div>

                                    </div>


                                    {/* BOTÃO SEPARADO DO CARD */}

                                    <button
                                        type="button"
                                        className={
                                            'botao-nova-ocorrencia'
                                        }
                                        onClick={() =>
                                            abrirNovaOcorrencia(
                                                atividadeBaseGrupo
                                            )
                                        }
                                    >
                                        + Nova ocorrência
                                    </button>

                                </div>

                            );

                        }
                    )

                )}

            </div>


            {/* =====================================
                MODAL CADASTRAR/EDITAR
            ===================================== */}

            {modalFormularioAberto && (

                <Modal
                    titulo={
                        editandoId
                            ? 'Editar Atividade'
                            : 'Cadastrar Atividade'
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


                    <FormularioAtividade

                        atividade={atividade}

                        setAtividade={
                            setAtividade
                        }

                        descricao={descricao}

                        setDescricao={
                            setDescricao
                        }

                        data={data}

                        setData={setData}

                        voluntarioId={
                            voluntarioId
                        }

                        setVoluntarioId={
                            setVoluntarioId
                        }

                        voluntarios={
                            voluntarios
                        }

                        editandoId={
                            editandoId
                        }

                        aoCancelar={
                            fecharModalFormulario
                        }

                        aoSalvar={
                            salvarAtividade
                        }

                    />

                </Modal>

            )}


            {/* =====================================
                MODAL EXCLUSÃO
            ===================================== */}

            {modalExclusaoAberto &&
                atividadeParaExcluir && (

                <Modal
                    titulo="Confirmar exclusão"
                    aoFechar={
                        fecharConfirmacaoExclusao
                    }
                >

                    <div className="confirmacao-exclusao">

                        <p>
                            Deseja realmente excluir
                            esta ocorrência?
                        </p>


                        <strong>
                            {
                                atividadeParaExcluir
                                    .atividade
                            }
                        </strong>


                        <p>
                            Data:{' '}
                            {formatarData(
                                atividadeParaExcluir.data
                            )}
                        </p>


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
                                className={
                                    'botao-excluir-confirmar'
                                }
                                onClick={
                                    excluirAtividade
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    </div>

                </Modal>

            )}


            {/* =====================================
                MODAL NOVA OCORRÊNCIA
            ===================================== */}

            {modalNovaOcorrencia &&
                atividadeBase && (

                <Modal
                    titulo={
                        `Nova ocorrência — ` +
                        atividadeBase.atividade
                    }
                    aoFechar={() => {

                        setModalNovaOcorrencia(
                            false
                        );

                        setAtividadeBase(
                            null
                        );

                        setMensagem('');

                    }}
                >

                    {mensagem && (
                        <p className="mensagem-modal">
                            {mensagem}
                        </p>
                    )}


                    <form
                        className="formulario"
                        onSubmit={
                            cadastrarNovaOcorrencia
                        }
                    >

                        <div className="campo-formulario">

                            <label>
                                Data da ocorrência
                            </label>

                            <input
                                type="date"
                                value={
                                    dataOcorrencia
                                }
                                onChange={
                                    (evento) =>
                                        setDataOcorrencia(
                                            evento.target.value
                                        )
                                }
                                required
                            />

                        </div>


                        <div className="campo-formulario">

                            <label>
                                Voluntário responsável
                            </label>

                            {ehAdministrador ? (

                                <select
                                    value={
                                        voluntarioOcorrencia
                                    }
                                    onChange={
                                        (evento) =>
                                            setVoluntarioOcorrencia(
                                                evento.target.value
                                            )
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecione o voluntário
                                    </option>


                                    {voluntarios.map(
                                        (voluntario) => (

                                            <option
                                                key={
                                                    voluntario.id
                                                }
                                                value={
                                                    voluntario.id
                                                }
                                            >
                                                {
                                                    voluntario.nome
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            ) : (

                                <input
                                    type="text"
                                    value={
                                        voluntarioLogado?.nome ||
                                        'Voluntário não identificado'
                                    }
                                    readOnly
                                />

                            )}

                        </div>


                        <div className="acoes-formulario">

                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={() => {

                                    setModalNovaOcorrencia(
                                        false
                                    );

                                    setAtividadeBase(
                                        null
                                    );

                                    setMensagem('');

                                }}
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                className="botao-salvar"
                            >
                                Cadastrar ocorrência
                            </button>

                        </div>

                    </form>

                </Modal>

            )}

        </div>

    );
}


/*
 * ==================================================
 * FORMULÁRIO DE ATIVIDADE
 * ==================================================
 */

function FormularioAtividade({

    atividade,
    setAtividade,

    descricao,
    setDescricao,

    data,
    setData,

    voluntarioId,
    setVoluntarioId,

    voluntarios,

    editandoId,

    aoCancelar,
    aoSalvar

}) {

    return (

        <form
            className="formulario"
            onSubmit={aoSalvar}
        >

            <div className="campo-formulario">

                <label>
                    Atividade
                </label>

                <input
                    type="text"
                    value={atividade}
                    onChange={(evento) =>
                        setAtividade(
                            evento.target.value
                        )
                    }
                    required
                />

            </div>


            <div className="campo-formulario">

                <label>
                    Descrição
                </label>

                <textarea
                    value={descricao}
                    onChange={(evento) =>
                        setDescricao(
                            evento.target.value
                        )
                    }
                    rows="4"
                />

            </div>


            <div className="linha-formulario">

                <div className="campo-formulario">

                    <label>
                        Data
                    </label>

                    <input
                        type="date"
                        value={data}
                        onChange={(evento) =>
                            setData(
                                evento.target.value
                            )
                        }
                        required
                    />

                </div>


                <div className="campo-formulario">

                    <label>
                        Voluntário responsável
                    </label>

                    <select
                        value={voluntarioId}
                        onChange={(evento) =>
                            setVoluntarioId(
                                evento.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Selecione
                        </option>


                        {voluntarios.map(
                            (voluntario) => (

                                <option
                                    key={
                                        voluntario.id
                                    }
                                    value={
                                        voluntario.id
                                    }
                                >
                                    {
                                        voluntario.nome
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            <div className="acoes-formulario">

                <button
                    type="button"
                    className="botao-cancelar"
                    onClick={aoCancelar}
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

    );
}


export default Atividades;