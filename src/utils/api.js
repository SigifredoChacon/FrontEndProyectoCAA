import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.140.240.112:3000',
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