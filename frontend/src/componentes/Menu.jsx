function Menu({ aoSair, aoAbrirPagina }) {
    return (
        <nav>
            <h1>ONG Projeto Esperança</h1>

            <div>
                <button onClick={() => aoAbrirPagina('assistidos')}>Assistidos</button>
                <button>Voluntários</button>
                <button>Atividades</button>
                <button>Participação</button>
                <button>Relatórios</button>
                <button onClick={aoSair}>Sair</button>
            </div>
        </nav>
    );
}

export default Menu;