import api from '../utils/api';

export const getRooms = async () => {
    const response = await api.get('/rooms');
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
        response = await api.patch(`/rooms/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } else {
        response = await api.patch(`/rooms/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return response.data;
};


export const deleteRoom = async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
};

export const getRoomById = async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
}

export const getNameRoomById = async (id) => {
    const response = await api.get(`/rooms/getName/${id}`);
    return response.data;
}