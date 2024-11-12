import axios from 'axios';

const api = axios.create({
    baseURL: 'https://proyecto-caa.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;