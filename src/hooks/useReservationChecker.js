import { useState, useEffect, useContext } from 'react';
import {getReservationByUserId, getReservationByUserIdComplete} from '../services/reservationService';
import {useAuthContext} from "./useAuthContext.js";

const useReservationChecker = () => {
    const { user } = useAuthContext();
    const [expiredReservations, setExpiredReservations] = useState([]);

    useEffect(() => {
        const checkReservations = async () => {
            try {

                const reservations = await getReservationByUserIdComplete(user);

                console.log(reservations)
                const now = new Date();

                const expired = reservations.filter(reservation => {
                    const reservationDate = new Date(reservation.Fecha);
                    const endTime = reservation.HoraFin;
                    const [hours, minutes] = endTime.split(':');
                    reservationDate.setHours(hours);
                    reservationDate.setMinutes(minutes);

                    // Verificamos si la reserva ya ha pasado
                    return reservationDate < now && !reservation.EncuestaCompletada;
                });

                setExpiredReservations(expired);
            } catch (error) {
                console.error('Error al obtener reservaciones:', error);
            }
        };

        const intervalId = setInterval(checkReservations, 60 * 60 * 1000);  // Cada 1 hora

        checkReservations();

        return () => clearInterval(intervalId);
    }, [user]);

    return expiredReservations;
};

export default useReservationChecker;
