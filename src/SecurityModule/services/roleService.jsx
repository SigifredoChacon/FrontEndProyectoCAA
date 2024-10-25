import api from '../../utils/api.js';

export const getRoles = async () => {
    const response = await api.get('/roles');
    return response.data;
}

export const getByRoleName = async (nombre) => {
    const response = await api.get(`/roles/${nombre}`);
    return response.data;
}
