import api from '../utils/api'; // Configuración base de Axios

export const getResources = async () => {
    const response = await api.get('/resources'); // Llama a la API para obtener usuarios
    return response.data;
};

export const createResource = async (resource) => {
    const response = await api.post('/resources', resource); // Llama a la API para crear un nuevo usuario
    return response.data;
};

export const updateResource = async (id, resource) => {
    const response = await api.patch(`/resources/${id}`, resource); // Llama a la API para actualizar un usuario por ID
    return response.data;
};

export const deleteResource = async (id) => {
    const response = await api.delete(`/resources/${id}`); // Llama a la API para eliminar un usuario por ID
    return response.data;
};

export const getResourceById = async (id) => {
    const response = await api.get(`/resources/${id}`); // Llama a la API para obtener un usuario por ID
    return response.data;
}
