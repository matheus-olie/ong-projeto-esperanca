import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Adciona o token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Verificação de token expirado
api.interceptors.response.use(
    (resposta) => {
        return resposta
    },

    (error) => {
        if (error.response && error.response.status === 401) {

            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.reload();
        }

        return Promise.reject(error)
    }
);

export default api;