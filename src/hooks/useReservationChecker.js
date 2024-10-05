import { useState, useEffect, useContext } from 'react';
import { getReservationByUserId } from '../services/reservationService';
import {useAuthContext} from "./useAuthContext.js";

const useReservationChecker = () => {
    const { user } = useAuthContext();
    const [expiredReservations, setExpiredReservations] = useState([]);

    useEffect(() => {
        // Función para verificar si una reserva ya ha expirado
        const checkReservations = async () => {
            try {
                const reservations = await getReservationByUserId(user);
                const now = new Date();

                const expired = reservations.filter(reservation => {
                    const reservationDate = new Date(reservation.Fecha);  // Cambia esto si el campo de fecha tiene otro nombre
                    const endTime = reservation.HoraFin;  // Suponiendo que HoraFin existe
                    const [hours, minutes] = endTime.split(':');
                    reservationDate.setHours(hours);
                    reservationDate.setMinutes(minutes);

                    // Verificamos si la reserva ya ha pasado
                    return reservationDate < now && !reservation.EncuestaCompletada;  // Cambia esto según tu modelo
                });

                setExpiredReservations(expired);
            } catch (error) {
                console.error('Error al obtener reservaciones:', error);
            }
        };

        // Llamamos a la función cada cierto tiempo (por ejemplo, cada hora)
        const intervalId = setInterval(checkReservations, 60 * 60 * 1000);  // Cada 1 hora

        // Verificamos al menos una vez cuando se monta el componente
        checkReservations();

        // Limpiar el intervalo cuando se desmonte el componente
        return () => clearInterval(intervalId);
    }, [user]);  // El efecto depende del id del usuario

    return expiredReservations;
};

export default useReservationChecker;
