import { useState } from 'react';

import api from '../servicos/api';

function Relatorios() {

    const [tipoRelatorio, setTipoRelatorio] = useState('');
    const [dados, setDados] = useState([]);
    const [mensagem, setMensagem] = useState('');

    async function gerarRelatorio(tipo) {

        setTipoRelatorio(tipo);
        setMensagem('');
        setDados([]);

        try {

            const resposta = await api.get(`/relatorios/${tipo}`);

            setDados(resposta.data);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                erro?.response?.data?.mensagem ||
                'Erro ao gerar o relatório.'
            );
        }
    }

    function formatarData(data) {

        if (!data) {
            return '';
        }

        return new Date(data).toLocaleDateString('pt-BR');
    }

    function tituloRelatorio() {

        const titulos = {
            assistidos: 'Relatório de Assistidos',
            voluntarios: 'Relatório de Voluntários',
            atividades: 'Relatório de Atividades',
            participacao: 'Relatório de Participação'
        };

        return titulos[tipoRelatorio] || 'Relatórios';
    }

    return (
        <div className="pagina pagina-relatorios">

            <div className="barra-relatorios">

                <button
                    className="botao-relatorio"
                    onClick={() => gerarRelatorio('assistidos')}
                >
                    👥 Assistidos
                </button>

                <button
                    className="botao-relatorio"
                    onClick={() => gerarRelatorio('voluntarios')}
                >
                    👤 Voluntários
                </button>

                <button
                    className="botao-relatorio"
                    onClick={() => gerarRelatorio('atividades')}
                >
                    📅 Atividades
                </button>

                <button
                    className="botao-relatorio"
                    onClick={() => gerarRelatorio('participacao')}
                >
                    📋 Participação
                </button>

            </div>

            {mensagem && (
                <p className="mensagem">
                    {mensagem}
                </p>
            )}

            {tipoRelatorio && !mensagem && (
                <div className="cabecalho-relatorio area-impressao">

                    <h2>
                        {tituloRelatorio()}
                    </h2>

                    <button
                        className="botao-imprimir"
                        onClick={() => window.print()}
                    >
                        🖨️ Imprimir
                    </button>

                </div>
            )}

            {dados.length > 0 && (

                <div className="tabela-container area-impressao">

                    <table>

                        <thead>

                            {tipoRelatorio === 'assistidos' && (
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Idade</th>
                                    <th>Escola</th>
                                    <th>Série</th>
                                    <th>Responsável</th>
                                    <th>Telefone</th>
                                </tr>
                            )}

                            {tipoRelatorio === 'voluntarios' && (
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Área de atuação</th>
                                </tr>
                            )}

                            {tipoRelatorio === 'atividades' && (
                                <tr>
                                    <th>Atividade</th>
                                    <th>Descrição</th>
                                    <th>Data</th>
                                    <th>Voluntário</th>
                                </tr>
                            )}

                            {tipoRelatorio === 'participacao' && (
                                <tr>
                                    <th>Assistido</th>
                                    <th>Atividade</th>
                                    <th>Data</th>
                                    <th>Voluntário</th>
                                    <th>Presença</th>
                                    <th>Observação</th>
                                </tr>
                            )}

                        </thead>

                        <tbody>

                            {tipoRelatorio === 'assistidos' &&
                                dados.map((assistido) => (
                                    <tr key={assistido.id}>
                                        <td>{assistido.nome}</td>
                                        <td>{assistido.cpf}</td>
                                        <td>{assistido.idade}</td>
                                        <td>{assistido.escola}</td>
                                        <td>{assistido.serie}</td>
                                        <td>{assistido.responsavel}</td>
                                        <td>{assistido.telefone}</td>
                                    </tr>
                                ))
                            }

                            {tipoRelatorio === 'voluntarios' &&
                                dados.map((voluntario) => (
                                    <tr key={voluntario.id}>
                                        <td>{voluntario.nome}</td>
                                        <td>{voluntario.cpf}</td>
                                        <td>{voluntario.email}</td>
                                        <td>{voluntario.telefone}</td>
                                        <td>{voluntario.area_atuacao}</td>
                                    </tr>
                                ))
                            }

                            {tipoRelatorio === 'atividades' &&
                                dados.map((atividade) => (
                                    <tr key={atividade.id}>
                                        <td>{atividade.atividade}</td>
                                        <td>{atividade.descricao}</td>
                                        <td>{formatarData(atividade.data)}</td>
                                        <td>{atividade.voluntario}</td>
                                    </tr>
                                ))
                            }

                            {tipoRelatorio === 'participacao' &&
                                dados.map((participacao, indice) => (
                                    <tr key={`${participacao.assistido_id}-${participacao.atividade_id}-${indice}`}>
                                        <td>{participacao.assistido}</td>
                                        <td>{participacao.atividade}</td>
                                        <td>{formatarData(participacao.data)}</td>
                                        <td>{participacao.voluntario}</td>
                                        <td>
                                            <span
                                                className={
                                                    participacao.presenca === 'Presente'
                                                        ? 'presenca-presente'
                                                        : 'presenca-ausente'
                                                }
                                            >
                                                {participacao.presenca}
                                            </span>
                                        </td>
                                        <td>{participacao.observacao || '-'}</td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>
            )}

            {tipoRelatorio && dados.length === 0 && !mensagem && (
                <div className="mensagem">
                    Nenhum registro encontrado para este relatório.
                </div>
            )}

        </div>
    );
}

export default Relatorios;