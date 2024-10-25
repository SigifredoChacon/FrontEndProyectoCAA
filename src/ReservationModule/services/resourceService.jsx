import api from '../../utils/api.js';

export const getResources = async () => {
    const response = await api.get('/resources');
    return response.data;
};

export const createResource = async (resource) => {
    const response = await api.post('/resources', resource);
    return response;
};

export const updateResource = async (id, resource) => {
    const response = await api.patch(`/resources/${id}`, resource);
    return response;
};

export const deleteResource = async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
};

export const getResourceById = async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
}
