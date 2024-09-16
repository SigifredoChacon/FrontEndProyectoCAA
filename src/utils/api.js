import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Aquí puedes agregar lógica para añadir tokens de autenticación a las solicitudes
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;