const express = require('express');
const cors = require('cors');

const rotaAssistidos = require('./rotas/assistidos');
const rotaVoluntarios = require('./rotas/voluntarios');
const rotaAtividades = require('./rotas/atividades');
const rotaParticipacao = require('./rotas/participacao');
const rotaRelatorios = require('./rotas/relatorios');
const rotaAutenticacao = require('./rotas/autenticacao');

const autenticarToken = require('./middlewares/autenticarToken');

const app = express();

app.use(cors());
app.use(express.json());


// ROTA PUBLICA
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API da ONG Projeto Esperança funcionando!'
    });
});


// AUTENTICAÇÃO
app.use('/autenticacao', rotaAutenticacao);


// ROTAS PROTEGIDAS
app.use('/assistidos', autenticarToken, rotaAssistidos);
app.use('/voluntarios', autenticarToken, rotaVoluntarios);
app.use('/atividades', autenticarToken, rotaAtividades);
app.use('/participacao', autenticarToken, rotaParticipacao);
app.use('/relatorios', autenticarToken, rotaRelatorios);


app.listen(3000, () => {
    console.log('Servidor funcionando na porta 3000');
});