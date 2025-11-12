import api from '../../utils/api.js';

export const getReservation = async (page = 1, itemsPerPage = 10) => {
    const response = await api.get('/reservations', {
            params: { page, itemsPerPage }
        }
        );
    return response.data;
};

export const getPendingReservation = async () => {
    const response = await api.get('/reservations/pending');
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

export const getReservationByUserId = async (user, page = 1, itemsPerPage = 10) => {
    const response = await api.get(`/reservations/getbyUserId/${user}`, {
        params: { page, itemsPerPage }
    });
    return response.data;
};
export const getReservationByUserIdComplete = async (user) => {
    const response = await api.get(`/reservations/reservationsCompleted/${user}`);
    return response.data;
}
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

export const deleteReservationByDate = async (date) => {
    const response = await api.delete(`/reservations/deleteByDate/${date}`);
    return response.data;
};

export const shareReservation = async (reservation) => {
    const response = await api.post('/reservations/shareReservation', reservation);
    return response.data;
};
export const getReservationsByCubicleIdAndWeek = async (cubicleId, startDate, endDate) => {
    const response = await api.get(`/reservations/getbyCubicleIdDate/${cubicleId}`, {
        params: {
            startDate,
            endDate
        }
    });
    return response.data;
};
export const getReservationsByRoomIdAndWeek = async (roomId, startDate, endDate) => {
    const response = await api.get(`/reservations/getbyRoomIdDate/${roomId}`, {
        params: {
            startDate,
            endDate
        }
    });
    return response.data;
}

export const getReservationsByYear = async (year) => {
    const response = await api.get(`/reservations/year/${year}`);
    return response.data;
};

export const getReservationsByMonth = async (year, month) => {
    const response = await api.get(`/reservations/month/${year}/${month}`);
    return response.data;
};

export const getReservationsByRange = async (startDate, endDate) => {
    const response = await api.get(`/reservations/range`, {
        params: {
            startDate,
            endDate
        }
    });
    return response.data;
};
