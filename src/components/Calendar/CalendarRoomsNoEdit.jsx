import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameWeek, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlotNoEdit from './TimeSlotNoEdit';
import PropTypes from 'prop-types';
import {
    getReservationByRoomId,
    getReservationById,
    getReservationsByRoomIdAndWeek
} from "../../services/reservationService.jsx";

const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'];

const CalendarRoomsNoEdit = ({ selectedRoomId, onReservationsChange, editable = true, reservationId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [existingReservations, setExistingReservations] = useState([]);
    const [userReservation, setUserReservation] = useState(null);

    useEffect(() => {
        const fetchUserReservation = async () => {
            try {
                if (reservationId) {
                    const userRes = await getReservationById(reservationId);
                    if (userRes) {
                        const userReservationDate = new Date(userRes.Fecha);
                        setUserReservation({
                            ...userRes,
                            day: userReservationDate,
                        });

                        // Si existe una reservación del usuario, ajustamos la fecha seleccionada a la fecha de la reserva
                        setSelectedDate(userReservationDate);
                    }
                }
            } catch (error) {
                console.error("Error fetching user reservation:", error);
            }
        };

        fetchUserReservation();
    }, [reservationId]);

    // Cálculo de la semana seleccionada basado en la fecha de la reserva
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i)); // Solo de lunes a sábado

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const startDate = format(startOfSelectedWeek, 'yyyy-MM-dd');
                const endDate = format(addDays(startOfSelectedWeek, 6), 'yyyy-MM-dd');

                const response = await getReservationsByRoomIdAndWeek(selectedRoomId, startDate, endDate);
                console.log("Estas son las reservaciones: ", response);
                const formattedReservations = response.map(reservation => ({
                    ...reservation,
                    day: new Date(reservation.Fecha),
                }));

                setExistingReservations(formattedReservations);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        if (selectedRoomId) {
            fetchReservations();
        }
    }, [selectedRoomId, startOfSelectedWeek]);

    const isReserved = (day, time) => {
        const currentTime = new Date(`1970-01-01T${time}:00`);

        // Verificar si la reserva del usuario está en este día y hora
        if (userReservation && startOfDay(userReservation.day).getTime() === startOfDay(day).getTime()) {
            const startTime = new Date(`1970-01-01T${userReservation.HoraInicio}:00`);
            const endTime = new Date(`1970-01-01T${userReservation.HoraFin}:00`);
            if (currentTime >= startTime && currentTime < endTime) {
                return 'userReserved'; // Retornar 'userReserved' si es la reserva del usuario
            }
        }

        // Verificar si hay alguna otra reserva en este día y hora
        const existingReservation = existingReservations.find((reservation) => {
            const reservationDay = new Date(reservation.Fecha);
            if (startOfDay(reservationDay).getTime() === startOfDay(day).getTime()) {
                const startTime = new Date(`1970-01-01T${reservation.HoraInicio}:00`);
                const endTime = new Date(`1970-01-01T${reservation.HoraFin}:00`);
                return currentTime >= startTime && currentTime < endTime;
            }
            return false;
        });

        if (existingReservation) {
            return 'reserved'; // Si hay una reserva existente, mostrar como reservada
        }

        return 'available'; // Si no está reservada, está disponible
    };

    return (
        <div className="calendar max-w-full box-border">
            <div className="flex flex-col items-center">
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="p-2 text-base rounded-md border border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:outline-none transition duration-300 ease-in-out max-w-full"
                    disabled={!editable}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse bg-gray-100 rounded-lg shadow-md mt-5">
                    <thead>
                    <tr>
                        <th></th>
                        {daysOfWeek.map((day, index) => (
                            <th key={index} className="p-3 border border-gray-300 bg-blue-900 text-white text-sm font-bold uppercase text-center">
                                {format(day, 'EEEE dd/MM', { locale: es })}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {timeSlots.map((time, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="p-3 border border-gray-300 font-bold bg-gray-200 text-center text-sm">
                                {time}
                            </td>
                            {daysOfWeek.map((day, colIndex) => (
                                <td key={colIndex} className="p-3 border border-gray-300 text-center text-sm">
                                    <TimeSlotNoEdit
                                        day={day}
                                        time={time}
                                        isReserved={isReserved(day, time)}
                                        onReserve={() => {}}
                                        disabled={!editable || isReserved(day, time) === 'reserved'}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

CalendarRoomsNoEdit.propTypes = {
    selectedRoomId: PropTypes.number.isRequired,
    onReservationsChange: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    reservationId: PropTypes.number.isRequired,
};

export default CalendarRoomsNoEdit;
