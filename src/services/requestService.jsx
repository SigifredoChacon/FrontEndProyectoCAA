import api from '../utils/api';

export const getRequest = async () => {
    const response = await api.get('/applications');
    return response.data;
};
export const getRequestByUserId = async (id) => {
    const response = await api.get(`/applications/getbyUserId/${id}`);
    return response.data;
}
export const createRequest = async (request) => {
    const response = await api.post('/applications', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};



export const updateRequest = async (id, request) => {
    const response = await api.patch(`/applications/${id}`, request);
    return response.data;
};

export const deleteRequest = async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
};

export const getRequestById = async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
};
export const sendJustification = async (idSolicitud,idUsuario, justificacion) => {
    const response = await api.post('/applications/sendJustification', {
        idSolicitud,
        idUsuario,
        justificacion
    });
    return response.data;
};