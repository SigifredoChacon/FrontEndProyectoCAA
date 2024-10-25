import api from '../../utils/api.js';

export const createValoration = async (valoration) => {
    try {
        const response = await api.post('/valorations', valoration);
        return response.data;
    } catch (error) {
        console.error('Error al crear valoración:', error);
        throw error;
    }
};

export const getAllValorations = async () => {
    try {
        const response = await api.get('/valorations');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las valoraciones:', error);
        throw error;
    }
};

export const getValorationsByRoomId = async (roomId) => {
    const response = await api.get(`/valoraciones/room/${roomId}`);
    return response.data;
};

export const getValorationsByCubicleId = async (cubicleId) => {
    const response = await api.get(`/valoraciones/cubicle/${cubicleId}`);
    return response.data;
};

