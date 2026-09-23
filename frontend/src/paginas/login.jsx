import { useState } from "react";
import api from '../servicos/api';
import imgLogo from '../assets/logo_projeto_esp.png'

function Login({ aoEntrar }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function realizarLogin(evento) {
        evento.preventDefault();

        setMensagem('');
        setCarregando(true);

        try {
            const resposta = await api.post('/autenticacao/login', {
                email,
                senha
            });

            localStorage.setItem('token', resposta.data.token);

            localStorage.setItem(
                'usuario',
                JSON.stringify(resposta.data.usuario)
            );

            aoEntrar();

            setMensagem('Login realizado com sucesso!');

            console.log('Usuario:', resposta.data.usuario);

        } catch (error) {
            if (error.response) {
                setMensagem(error.response.data.mensagem)
            } else {
                setMensagem('Não foi possível conectar ao servidor.');
            }
        } finally {
            setCarregando(false)
        }
    }

    return(
        <div className="cabecalho_login">
            <img src={imgLogo} alt="Logo do Projeto Esperança" />

            <div className="body_login">
                <h2>Login</h2>

                <form onSubmit={realizarLogin}>
                    <div className="label_login">

                        <div className="linha_login">
                            <label>E-mail</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(evento) => setEmail(evento.target.value)}
                                placeholder="  Digite seu e-mail"
                            />
                        </div>

                        <div className="linha_login">
                            <label>Senha</label>
        
                            <input
                                type="password"
                                value={senha}
                                onChange={(evento) => setSenha(evento.target.value)}
                                placeholder="  Digite sua senha"
                            />
                        </div>    
                    </div>

                    

                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>

                </form>
            </div>

            {mensagem && (
                <p>{mensagem}</p>
            )}
        </div>
    );
    
}

export default Login;