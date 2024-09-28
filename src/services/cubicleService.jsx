import api from '../utils/api';

export const getCubicles = async () => {
    const response = await api.get('/cubicles');
    return response.data;
};

export const createCubicle = async (cubicle) => {
    const response = await api.post('/cubicles', cubicle);
    return response.data;
};

export const updateCubicle = async (id, cubicle) => {
    const response = await api.patch(`/cubicles/${id}`, cubicle);
    return response.data;
};

export const deleteCubicle = async (id) => {
    const response = await api.delete(`/cubicles/${id}`);
    return response.data;
};

export const getCubicleById = async (id) => {
    const response = await api.get(`/cubicles/${id}`);
    return response.data;
};

export const lockCubicle = async () => {
    const response = await api.patch(`/cubicles/cubicleLock`);
    return response.data;
};

export const unLockCubicle = async () => {
    const response = await api.patch(`/cubicles/cubicleUnLock`);
    return response.data;
};
