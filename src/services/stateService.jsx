import api from '../utils/api';

export const getStates = async () => {
    const response = await api.get('/states');
    return response.data;
}

export const getByStateName = async (nombre) => {
    const response = await api.get(`/states/${nombre}`);
    return response.data;
}
