import api from '../utils/api';

// Crear una nueva valoración
export const createValoration = async (valoration) => {
    try {
        const response = await api.post('/valorations', valoration);
        return response.data;
    } catch (error) {
        console.error('Error al crear valoración:', error);
        throw error;
    }
};

// Obtener todas las valoraciones
export const getAllValorations = async () => {
    try {
        const response = await api.get('/valorations');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las valoraciones:', error);
        throw error;
    }
};

// Obtener valoraciones por sala
export const getValorationsByRoomId = async (roomId) => {
    const response = await api.get(`/valoraciones/room/${roomId}`);
    return response.data;
};

// Obtener valoraciones por cubículo
export const getValorationsByCubicleId = async (cubicleId) => {
    const response = await api.get(`/valoraciones/cubicle/${cubicleId}`);
    return response.data;
};

