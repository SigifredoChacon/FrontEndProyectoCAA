import api from '../utils/api';

export const getResources = async () => {
    const response = await api.get('/resources');
    return response.data;
};

export const createResource = async (resource) => {
    const response = await api.post('/resources', resource);
    return response.data;
};

export const updateResource = async (id, resource) => {
    const response = await api.patch(`/resources/${id}`, resource);
    return response.data;
};

export const deleteResource = async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
};

export const getResourceById = async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
}
