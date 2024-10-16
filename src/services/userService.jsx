import api from '../utils/api';

export const getUsers = async () => {
    const response = await api.get('/users');
    return response;
};

export const createUser = async (user) => {
    const response = await api.post('/users', user);
    return response;
};

export const login = async (user) => {
    const response = await api.post('/users/login', user);
    return response;
};


export const updateUser = async (id, user) => {
    const response = await api.patch(`/users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};
export const sendAllEmail = async (email) => {
    const response = await api.post('/users/generalEmails', email);
    return response.data;
}
