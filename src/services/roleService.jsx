import api from '../utils/api'; // Configuración base de Axios

export const getRoles = async () => {
    const response = await api.get('/roles'); // Llama a la API para obtener usuarios
    return response.data;
}