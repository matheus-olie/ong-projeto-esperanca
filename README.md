# Projeto Esperança

Sistema web desenvolvido para auxiliar a **ONG Projeto Esperança** na gestão de assistidos, voluntários, atividades e participações.

O projeto foi desenvolvido como parte do **Projeto de Extensão V**, dando continuidade ao levantamento de requisitos e à análise realizados no Projeto de Extensão IV.

## Funcionalidades

### Autenticação
- Login por e-mail e senha
- Autenticação utilizando JWT
- Controle de acesso por perfil
- Perfis de administrador e voluntário
- Proteção das rotas da API

### Assistidos
- Cadastro de assistidos
- Consulta e pesquisa
- Edição
- Exclusão
- Validação de CPF, telefone e idade

### Voluntários
- Cadastro de voluntários
- Consulta e pesquisa
- Edição
- Exclusão
- Validação de CPF, telefone e e-mail

### Atividades
- Cadastro de atividades
- Registro de novas ocorrências
- Organização das ocorrências por atividade
- Identificação de atividades realizadas, atuais e futuras
- Associação do voluntário responsável

### Participação
- Registro da participação dos assistidos
- Controle de presença
- Registro de observações
- Consulta das participações

### Relatórios
- Relatório de assistidos
- Relatório de voluntários
- Relatório de atividades
- Relatório de participações
- Impressão dos relatórios

## Perfis de acesso

### Administrador

O administrador possui acesso às funcionalidades de gerenciamento do sistema, incluindo cadastro, edição e exclusão dos registros permitidos.

### Voluntário

O voluntário possui acesso às funcionalidades de consulta e pode registrar participação e novas ocorrências de atividades existentes.

Ao registrar uma nova ocorrência, o próprio voluntário autenticado é definido automaticamente como responsável.

## Tecnologias utilizadas

### Front-end
- React
- Vite
- JavaScript
- CSS
- Axios

### Back-end
- Node.js
- Express
- JWT
- bcryptjs
- CORS
- dotenv

### Banco de dados
- MySQL
- mysql2

### Ferramentas
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub

## Estrutura do projeto

```text
ong-projeto-esperanca/
├── backend/
│   ├── src/
│   │   ├── controladores/
│   │   ├── middlewares/
│   │   ├── rotas/
│   │   ├── banco.js
│   │   └── servidor.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── componentes/
│   │   ├── paginas/
│   │   ├── servicos/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Segurança

As informações sensíveis utilizadas pelo back-end são armazenadas em variáveis de ambiente e não são versionadas no repositório.

Entre as medidas implementadas estão:

- senhas armazenadas utilizando hash;
- autenticação com JWT;
- rotas protegidas por middleware;
- controle de acesso conforme o perfil do usuário;
- validações no front-end e no back-end;
- proteção das variáveis de ambiente por meio do `.gitignore`.

## Responsividade

A interface foi adaptada para diferentes tamanhos de tela.

Em telas maiores, o sistema utiliza navegação lateral. Em telas menores, a navegação é realizada por uma barra superior com menu expansível.

## Execução do projeto

### Back-end

Na pasta `backend`:

```bash
npm install
node src/servidor.js
```

O servidor será executado, por padrão, na porta `3000`.

### Front-end

Na pasta `frontend`:

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Observação

Para executar o sistema é necessário configurar as variáveis de ambiente do back-end com os dados de conexão do MySQL e a chave utilizada para geração dos tokens JWT.