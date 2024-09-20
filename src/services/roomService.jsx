import api from '../utils/api'; // Configuración base de Axios

export const getRooms = async () => {
    const response = await api.get('/rooms'); // Llama a la API para obtener usuarios
    return response.data;
};

export const createRoom = async (formData) => {
    const response = await api.post('/rooms', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};


export const updateRoom = async (id, formData) => {
    let response;

    if (formData instanceof FormData) {
        // Si el objeto room es un FormData, se trata como multipart/form-data
        response = await api.patch(`/rooms/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } else {
        // Si room es un objeto normal, se trata como application/json
        response = await api.patch(`/rooms/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

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
