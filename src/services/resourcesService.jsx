import api from '../utils/api'; // Configuración base de Axios

export const getResources = async () => {
    const response = await api.get('/resources'); // Llama a la API para obtener usuarios
    return response.data;
}
