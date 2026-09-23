import { useEffect, useState } from 'react';

import api from '../servicos/api';
import Modal from '../componentes/Modal';

import {
    somenteNumeros,
    formatarCPF,
    formatarTelefone,
    validarCPF,
    validarTelefone
} from '../servicos/validacoes';

function Assistidos() {

    // USUÁRIO LOGADO
    const usuarioLogado =
        JSON.parse(localStorage.getItem('usuario') || 'null');

    const ehAdministrador =
        usuarioLogado?.perfil === 'administrador';

    // LISTA DE ASSISTIDOS
    const [assistidos, setAssistidos] = useState([]);

    // DADOS DO FORMULÁRIO
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [idade, setIdade] = useState('');
    const [escola, setEscola] = useState('');
    const [serie, setSerie] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [telefone, setTelefone] = useState('');

    // CONTROLES
    const [mensagem, setMensagem] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    // CONTROLE DOS MODAIS
    const [modalFormularioAberto, setModalFormularioAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    // ASSISTIDO QUE SERÁ EXCLUÍDO
    const [assistidoParaExcluir, setAssistidoParaExcluir] = useState(null);

    // PESQUISA
    const [pesquisa, setPesquisa] = useState('');


    // CARREGA OS ASSISTIDOS AO ABRIR A PÁGINA
    useEffect(() => {
        listarAssistidos();
    }, []);


    // LISTAR ASSISTIDOS
    async function listarAssistidos() {
        try {

            const resposta = await api.get('/assistidos');

            setAssistidos(resposta.data);

        } catch (erro) {

            console.error(erro);

            setMensagem('Erro ao carregar os assistidos.');
        }
    }


    // LIMPAR FORMULÁRIO
    function limparFormulario() {

        setNome('');
        setCpf('');
        setIdade('');
        setEscola('');
        setSerie('');
        setResponsavel('');
        setTelefone('');

        setEditandoId(null);
    }


    // ABRIR MODAL PARA CADASTRAR
    function abrirCadastro() {

        if (!ehAdministrador) {
            return;
        }

        limparFormulario();

        setMensagem('');

        setModalFormularioAberto(true);
    }


    // FECHAR MODAL DO FORMULÁRIO
    function fecharModalFormulario() {

        setModalFormularioAberto(false);

        limparFormulario();

        setMensagem('');
    }


    // SALVAR OU EDITAR ASSISTIDO
    async function salvarAssistido(evento) {

        evento.preventDefault();

        if (!ehAdministrador) {
            return;
        }

        setMensagem('');

        if (!validarCPF(cpf)) {
            setMensagem(
                'CPF inválido. Verifique os números informados!'
            );

            return;
        }

        if (!validarTelefone(telefone)) {

            setMensagem(
                'Telefone inválido. Informe um telefone brasileiro válido!'
            );

            return;
        }

        const dadosAssistido = {
            nome,
            cpf,
            idade: Number(idade),
            escola,
            serie,
            responsavel,
            telefone
        };


        try {

            if (editandoId) {

                await api.put(
                    `/assistidos/${editandoId}`,
                    dadosAssistido
                );

                await listarAssistidos();

                fecharModalFormulario();

                setMensagem(
                    'Assistido atualizado com sucesso!'
                );

                return;
            }

            await api.post(
                '/assistidos',
                dadosAssistido
            );

            await listarAssistidos();

            fecharModalFormulario();

            setMensagem(
                'Assistido cadastrado com sucesso!'
            );

        } catch (error) {
            console.error('Erro ao salvar assistido:', error);

            if (error?.response?.status === 409) {

                setMensagem('CPF já cadastrado!');

                return;
            }

            if (error?.response?.data?.mensagem) {

                setMensagem(
                    error.response.data.mensagem
                );

                return;
            }

            setMensagem(
                'Não foi possível comunicar com o servidor.'
            );
        }
    }


    // ABRIR MODAL DE EDIÇÃO
    function editarAssistido(assistido) {

        if (!ehAdministrador) {
            return;
        }

        setEditandoId(assistido.id);

        setNome(assistido.nome);
        setCpf(assistido.cpf);
        setIdade(assistido.idade);
        setEscola(assistido.escola);
        setSerie(assistido.serie);
        setResponsavel(assistido.responsavel);
        setTelefone(assistido.telefone);

        setMensagem('');

        setModalFormularioAberto(true);
    }


    // ABRIR CONFIRMAÇÃO DE EXCLUSÃO
    function abrirConfirmacaoExclusao(assistido) {

        if (!ehAdministrador) {
            return;
        }

        setAssistidoParaExcluir(assistido);

        setModalExclusaoAberto(true);
    }


    // FECHAR CONFIRMAÇÃO DE EXCLUSÃO
    function fecharConfirmacaoExclusao() {

        setAssistidoParaExcluir(null);

        setModalExclusaoAberto(false);
    }


    // EXCLUIR ASSISTIDO
    async function excluirAssistido() {

        if (!ehAdministrador || !assistidoParaExcluir) {
            return;
        }


        try {

            await api.delete(
                `/assistidos/${assistidoParaExcluir.id}`
            );

            await listarAssistidos();

            fecharConfirmacaoExclusao();


        } catch (erro) {

            console.error(erro);

            if (erro.response) {

                setMensagem(
                    erro.response.data.mensagem
                );

            } else {

                setMensagem(
                    'Erro ao excluir o assistido.'
                );
            }
        }
    }


    // FILTRO DA PESQUISA
    const assistidosFiltrados = assistidos.filter(
        (assistido) => {

            const textoPesquisa = pesquisa.toLowerCase();

            return (
                assistido.nome.toLowerCase().includes(textoPesquisa) ||
                assistido.cpf.includes(pesquisa)
            );
        }
    );


    return (
        <div className="pagina">

            {/* CABEÇALHO DA PÁGINA */}

            <div className="barra-acoes">

                <div className="campo-pesquisa">

                    <input
                        type="text"
                        placeholder="🔎 Pesquisar por nome ou CPF..."
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
                        + Cadastrar assistido
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
                            <th>Idade</th>
                            <th>Escola</th>
                            <th>Série</th>
                            <th>Responsável</th>
                            <th>Telefone</th>

                            {ehAdministrador && (
                                <th>Ações</th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {assistidosFiltrados.length === 0 ? (

                            <tr>

                                <td colSpan={ehAdministrador ? 8 : 7}>
                                    Nenhum assistido encontrado.
                                </td>

                            </tr>

                        ) : (

                            assistidosFiltrados.map(
                                (assistido) => (

                                    <tr key={assistido.id}>

                                        <td>
                                            {assistido.nome}
                                        </td>

                                        <td>
                                            {formatarCPF(assistido.cpf)}
                                        </td>

                                        <td>
                                            {assistido.idade}
                                        </td>

                                        <td>
                                            {assistido.escola}
                                        </td>

                                        <td>
                                            {assistido.serie}
                                        </td>

                                        <td>
                                            {assistido.responsavel}
                                        </td>

                                        <td>
                                            {formatarTelefone(assistido.telefone)}
                                        </td>

                                        {ehAdministrador && (
                                            <td>

                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        editarAssistido(
                                                            assistido
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        abrirConfirmacaoExclusao(
                                                            assistido
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
                            ? 'Editar Assistido'
                            : 'Cadastrar Assistido'
                    }
                    aoFechar={fecharModalFormulario}
                >
                    {mensagem && (
                        <p className="mensagem-modal">
                            {mensagem}
                        </p>
                    )}

                    <form
                        className="formulario"
                        onSubmit={salvarAssistido}
                    >

                        <div className="campo-formulario">

                            <label>Nome</label>

                            <input
                                type="text"
                                value={nome}
                                onChange={(evento) =>
                                    setNome(evento.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="linha-formulario">

                            <div className="campo-formulario">

                                <label>CPF</label>

                                <input
                                    type="text"
                                    value={formatarCPF(cpf)}
                                    onChange={(evento) => {
                                        setCpf(evento.target.value.replace(/\D/g, ''));
                                    }}

                                    inputMode="numeric"
                                    maxLength="14"
                                    placeholder="000.000.000-00"
                                    required
                                />

                            </div>


                            <div className="campo-formulario">

                                <label>Idade</label>

                                <input
                                    type="number"
                                    min="7"
                                    max="17"
                                    value={idade}
                                    onChange={(evento) =>
                                        setIdade(evento.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="campo-formulario">

                            <label>Escola</label>

                            <input
                                type="text"
                                value={escola}
                                onChange={(evento) =>
                                    setEscola(evento.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="linha-formulario">

                            <div className="campo-formulario">

                                <label>Série</label>

                                <input
                                    type="text"
                                    value={serie}
                                    onChange={(evento) =>
                                        setSerie(evento.target.value)
                                    }
                                    required
                                />

                            </div>


                            <div className="campo-formulario">

                                <label>Telefone</label>

                                <input
                                    type="text"
                                    value={formatarTelefone(telefone)}
                                    onChange={(evento) => {
                                        setTelefone(evento.target.value.replace(/\D/g, ''));
                                    }}
                                    inputMode="numeric"
                                    maxLength="15"
                                    placeholder="(00) 00000-0000"
                                    required
                                />

                            </div>

                        </div>


                        <div className="campo-formulario">

                            <label>Responsável</label>

                            <input
                                type="text"
                                value={responsavel}
                                onChange={(evento) =>
                                    setResponsavel(evento.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="acoes-formulario">

                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={fecharModalFormulario}
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


            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}

            {modalExclusaoAberto &&
                ehAdministrador &&
                assistidoParaExcluir && (

                <Modal
                    titulo="Confirmar exclusão"
                    aoFechar={fecharConfirmacaoExclusao}
                >

                    <div className="confirmacao-exclusao">

                        <p>
                            Deseja realmente excluir o assistido:
                        </p>

                        <strong>
                            {assistidoParaExcluir.nome}
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
                                onClick={excluirAssistido}
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

export default Assistidos;
