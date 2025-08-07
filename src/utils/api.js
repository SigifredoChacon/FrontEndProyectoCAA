import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ERR_NETWORK') {
        return Promise.reject({
          customMessage: 'Error de conexión con el servidor',
          originalError: error
        });
      }
      if (error.response?.status === 404) {
        return Promise.reject({
          customMessage: 'Recurso no encontrado',
          originalError: error
        });
      }
      return Promise.reject(error);
    }
  );

export default api;