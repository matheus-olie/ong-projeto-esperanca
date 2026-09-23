import { useState } from 'react';

import Login from './paginas/login';
import Inicio from './paginas/inicio';

function App() {
    const [estaLogado, setEstaLogado] = useState(
        !!localStorage.getItem('token')
    );

    function entrar() {
        setEstaLogado(true);
    }

    function sair() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setEstaLogado(false);
    }

    if (estaLogado) {
        return <Inicio aoSair={sair} />;
    }

    return <Login aoEntrar={entrar} />;
}

export default App;