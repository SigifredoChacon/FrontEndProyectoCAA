import api from '../utils/api'; // Configuración base de Axios

export const getRooms = async () => {
    const response = await api.get('/rooms'); // Llama a la API para obtener usuarios
    return response.data;
};

export const createRoom = async (room) => {
    const response = await api.post('/rooms', room); // Llama a la API para crear un nuevo usuario
    return response.data;
};

export const updateRoom = async (id, room) => {
    const response = await api.patch(`/rooms/${id}`, room); // Llama a la API para actualizar un usuario por ID
    return response.data;
};

export const deleteRoom = async (id) => {
    const response = await api.delete(`/rooms/${id}`); // Llama a la API para eliminar un usuario por ID
    return response.data;
};

export const getRoomById = async (id) => {
    const response = await api.get(`/rooms/${id}`); // Llama a la API para obtener un usuario por ID
    return response.data;
}
