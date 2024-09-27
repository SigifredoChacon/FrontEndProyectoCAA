import api from '../utils/api';

export const getReservation = async () => {
    const response = await api.get('/reservations');
    return response.data;
};

export const createReservation = async (reservation) => {
    const response = await api.post('/reservations', reservation);
    return response.data;
};

export const updateReservation = async (id, reservation) => {
    const response = await api.patch(`/reservations/${id}`, reservation);
    return response.data;
};

export const deleteReservation = async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
};

export const getReservationById = async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
};

export const getReservationByUserId = async (id) => {
    const response = await api.get(`/reservations/getbyUserId/${id}`);
    return response.data;
};
export const getReservationByCubicleId = async (id) => {
    const response = await api.get(`/reservations/getbyCubicleId/${id}`);
    return response.data;
};
export const getReservationByRoomId = async (id) => {
    const response = await api.get(`/reservations/getbyRoomId/${id}`);
    return response.data;
};
export const getReservationByDate = async (date) => {
    const response = await api.get(`/reservations/getbyDate/${date}`);
    return response.data;
};
export const shareReservation = async (reservation) => {
    const response = await api.post('/reservations/shareReservation', reservation);
    return response.data;
}
