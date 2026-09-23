function Cabecalho({ paginaAtual }) {

    const nomesPaginas = {
        inicio: 'Dashboard',
        assistidos: 'Assistidos',
        voluntarios: 'Voluntários',
        atividades: 'Atividades',
        participacao: 'Participação',
        relatorios: 'Relatórios'
    };

    return (
        <header className="cabecalho">

            <div>
                <h1>{nomesPaginas[paginaAtual]}</h1>
            </div>

            <div className="usuario-cabecalho">

                <span>
                    {JSON.parse(localStorage.getItem('usuario'))?.email}
                </span>

            </div>

        </header>
    );
}

export default Cabecalho;