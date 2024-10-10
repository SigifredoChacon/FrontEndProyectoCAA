import api from '../utils/api';

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
}

export const getByCategoriesName = async (nombre) => {
    const response = await api.get(`/categories/${nombre}`);
    return response.data;
}
