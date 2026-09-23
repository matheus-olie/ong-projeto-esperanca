import { useState } from "react";
import imgLogo from "../assets/logo_projeto_esp.png";

function MenuLateral({ paginaAtual, aoAbrirPagina, aoSair }) {

    const [menuAberto, setMenuAberto] = useState(false);

    function abrirPagina(pagina) {
        aoAbrirPagina(pagina);
        setMenuAberto(false);
    }

    function sair() {
        setMenuAberto(false);
        aoSair();
    }

    return (
        <>
            {/* BARRA SUPERIOR - CELULAR */}
            <div className="barra-mobile">

                <button
                    className="botao-menu-mobile"
                    onClick={() => setMenuAberto(!menuAberto)}
                    aria-label="Abrir menu"
                >
                    {menuAberto ? '✕' : '☰'}
                </button>

                <img
                    src={imgLogo}
                    alt="Logo do Projeto Esperança"
                    className="logo-mobile"
                />

            </div>

            {/* MENU */}
            <aside
                className={`menu-lateral ${menuAberto ? 'menu-aberto' : ''}`}
            >

                <div className="logo">
                    <img
                        src={imgLogo}
                        alt="Logo do Projeto Esperança"
                    />
                </div>

                <nav>

                    <button
                        className={paginaAtual === 'inicio' ? 'ativo' : ''}
                        onClick={() => abrirPagina('inicio')}
                    >
                        🏠 Início
                    </button>

                    <button
                        className={paginaAtual === 'assistidos' ? 'ativo' : ''}
                        onClick={() => abrirPagina('assistidos')}
                    >
                        👥 Assistidos
                    </button>

                    <button
                        className={paginaAtual === 'voluntarios' ? 'ativo' : ''}
                        onClick={() => abrirPagina('voluntarios')}
                    >
                        👤 Voluntários
                    </button>

                    <button
                        className={paginaAtual === 'atividades' ? 'ativo' : ''}
                        onClick={() => abrirPagina('atividades')}
                    >
                        📅 Atividades
                    </button>

                    <button
                        className={paginaAtual === 'participacao' ? 'ativo' : ''}
                        onClick={() => abrirPagina('participacao')}
                    >
                        📋 Participação
                    </button>

                    <button
                        className={paginaAtual === 'relatorios' ? 'ativo' : ''}
                        onClick={() => abrirPagina('relatorios')}
                    >
                        📊 Relatórios
                    </button>

                </nav>

                <button
                    className="botao-sair"
                    onClick={sair}
                >
                    🚪 Sair
                </button>

            </aside>
        </>
    );
}

export default MenuLateral;