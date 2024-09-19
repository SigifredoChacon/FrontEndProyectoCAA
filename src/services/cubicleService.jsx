import api from '../utils/api'; // Configuración base de Axios

export const getCubicles = async () => {
    const response = await api.get('/cubicles'); // Llama a la API para obtener usuarios
    return response.data;
};

export const createCubicle = async (room) => {
    const response = await api.post('/cubicles', room); // Llama a la API para crear un nuevo usuario
    return response.data;
};

export const updateCubicle = async (id, room) => {
    const response = await api.patch(`/cubicles/${id}`, room); // Llama a la API para actualizar un usuario por ID
    return response.data;
};

export const deleteCubicle = async (id) => {
    const response = await api.delete(`/cubicles/${id}`); // Llama a la API para eliminar un usuario por ID
    return response.data;
};

export const getCubicleById = async (id) => {
    const response = await api.get(`/cubicles/${id}`); // Llama a la API para obtener un usuario por ID
    return response.data;
}
