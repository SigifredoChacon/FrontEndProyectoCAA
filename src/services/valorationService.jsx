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
export const getValorationsBySala = async (idSala) => {
    try {
        const response = await api.get(`/valorations/sala/${idSala}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener valoraciones por sala:', error);
        throw error;
    }
};

// Obtener valoraciones por cubículo
export const getValorationsByCubicle = async (idCubiculo) => {
    try {
        const response = await api.get(`/valorations/cubiculo/${idCubiculo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener valoraciones por cubículo:', error);
        throw error;
    }
};

// Eliminar una valoración por ID
export const deleteValoration = async (idEncuesta) => {
    try {
        const response = await api.delete(`/valorations/${idEncuesta}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar valoración:', error);
        throw error;
    }
};

// Actualizar una valoración
export const updateValoration = async (idEncuesta, valoration) => {
    try {
        const response = await api.patch(`/valorations/${idEncuesta}`, valoration);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar valoración:', error);
        throw error;
    }
};
