import api from '../utils/api'; // Configuración base de Axios

export const getUsers = async () => {
    const response = await api.get('/users'); // Llama a la API para obtener usuarios
    return response.data;
};

export const createUser = async (user) => {
    const response = await api.post('/users', user); // Llama a la API para crear un nuevo usuario
    return response.data;
};

export const updateUser = async (id, user) => {
    const response = await api.patch(`/users/${id}`, user); // Llama a la API para actualizar un usuario por ID
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`); // Llama a la API para eliminar un usuario por ID
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`); // Llama a la API para obtener un usuario por ID
    return response.data;
}
