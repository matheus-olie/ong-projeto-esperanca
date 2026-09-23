import { useState } from 'react';

import MenuLateral from '../componentes/MenuLateral';
import Cabecalho from '../componentes/Cabecalho';
import Assistidos from './Assistidos';
import Voluntarios from './Voluntarios';
import Atividades from './Atividades';
import Participacao from './Participacao';
import Relatorios from './Relatorios';

function Inicio({ aoSair }) {
    const [paginaAtual, setPaginaAtual] = useState('inicio');

    function abrirPagina(pagina) {
        setPaginaAtual(pagina);
    }

    return (
        <div className="estrutura">

            <MenuLateral
                paginaAtual={paginaAtual}
                aoAbrirPagina={abrirPagina}
                aoSair={aoSair}
            />

            <div className="area-principal">

                <Cabecalho
                    paginaAtual={paginaAtual}
                />

                <main className="conteudo">

                    {paginaAtual === 'inicio' && (
                        <div className="pagina-inicio">

                            <h2>Bem-vindo ao sistema!</h2>

                            <p>
                                Utilize o menu lateral para acessar
                                as funcionalidades da ONG.
                            </p>

                        </div>
                    )}

                    {paginaAtual === 'assistidos' && (
                        <Assistidos />
                    )}

                    {paginaAtual === 'voluntarios' && (
                        <Voluntarios />
                    )}

                    {paginaAtual === 'atividades' && (
                        < Atividades />
                    )}

                    {paginaAtual === 'participacao' && (
                        < Participacao />
                    )}

                    {paginaAtual === 'relatorios' && (
                        < Relatorios/>
                    )}

                </main>

            </div>

        </div>
    );
}

export default Inicio;