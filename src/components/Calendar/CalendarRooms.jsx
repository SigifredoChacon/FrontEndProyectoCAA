import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameWeek, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlot from './TimeSlot';
import PropTypes from 'prop-types';
import {getReservationByRoomId} from "../../services/reservationService.jsx";

const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const CalendarRooms = ({ selectedRoomId, onReservationsChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [existingReservations, setExistingReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i));

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await getReservationByRoomId(selectedRoomId);

                // Filtrar las reservas para la semana seleccionada
                const filteredReservations = response.filter(reservation => {
                    const reservationDate = new Date(reservation.Fecha);
                    return isSameWeek(reservationDate, startOfSelectedWeek, { weekStartsOn: 1 });
                });

                // Asegúrate de que las fechas estén en formato Date
                const formattedReservations = filteredReservations.map(reservation => ({
                    ...reservation,
                    day: new Date(reservation.Fecha),  // Asegúrate de que 'day' es un objeto Date
                }));

                setExistingReservations(formattedReservations);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        if (selectedRoomId) {
            fetchReservations();
        }
0
    }, [selectedRoomId, startOfSelectedWeek]);

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);

        if (reservations.length > 0) {
            if (isSameWeek(newDate, selectedDate, { weekStartsOn: 1 })) {
                setSelectedDate(newDate);
            } else {
                const confirmChange = window.confirm(
                    'Cambiar de semana eliminará las reservas actuales. ¿Deseas continuar?'
                );
                if (confirmChange) {
                    setReservations([]);
                    onReservationsChange([]);
                    setSelectedDate(newDate);
                    setSelectedDay(null);
                }
            }
        } else {
            setSelectedDate(newDate);
            setSelectedDay(null);
        }
    };

    const handleReserve = (day, time) => {
        const reservationIndex = reservations.findIndex(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );

        if (reservationIndex !== -1) {
            const newReservations = reservations.filter(
                (reservation) => !(reservation.day.getTime() === day.getTime() && reservation.time === time)
            );
            setReservations(newReservations);
            onReservationsChange(newReservations);

            if (newReservations.every(reservation => reservation.day.getTime() !== selectedDay?.getTime())) {
                setSelectedDay(null);
            }
        } else {
            if (!selectedDay || selectedDay.getTime() === day.getTime()) {
                const newReservations = [...reservations, { day, time, status: 'selected' }];
                setReservations(newReservations);
                onReservationsChange(newReservations);
                setSelectedDay(day);
            }
        }
    };

    const isReserved = (day, time) => {
        // Convertimos el 'time' actual en un objeto Date para facilitar la comparación
        const currentTime = new Date(`1970-01-01T${time}:00`);

        const existingReservation = existingReservations.find((reservation) => {
            const reservationDay = new Date(reservation.Fecha);
            if (startOfDay(reservationDay).getTime() === startOfDay(day).getTime()) {
                const startTime = new Date(`1970-01-01T${reservation.HoraInicio}:00`);
                const endTime = new Date(`1970-01-01T${reservation.HoraFin}:00`);

                // Si 'currentTime' está entre 'startTime' y 'endTime', se considera reservado
                return currentTime >= startTime && currentTime < endTime;
            }
            return false;
        });

        if (existingReservation) {
            return 'reserved';
        }

        const reservation = reservations.find(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );

        return reservation ? reservation.status : 'available';
    };


    return (
        <div className="calendar max-w-full box-border">
            <div className="flex flex-col items-center">

                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    className="p-2 text-base rounded-md border border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:outline-none transition duration-300 ease-in-out max-w-full"
                    disabled={reservations.length > 0 && selectedDay !== null} // Deshabilita si hay selección
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse bg-gray-100 rounded-lg shadow-md mt-5">
                    <thead>
                    <tr>
                        <th></th>
                        {daysOfWeek.map((day, index) => (
                            <th key={index}
                                className="p-3 border border-gray-300 bg-blue-900 text-white text-sm font-bold uppercase text-center">
                                {format(day, 'EEEE dd/MM', {locale: es})}
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
                                    <TimeSlot
                                        day={day}
                                        time={time}
                                        isReserved={isReserved(day, time)}
                                        onReserve={handleReserve}
                                        disabled={isReserved(day, time) === 'reserved' || (selectedDay && selectedDay.getTime() !== day.getTime())}
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

CalendarRooms.propTypes = {
    selectedRoomId: PropTypes.number.isRequired,
    onReservationsChange: PropTypes.func.isRequired,
};

export default CalendarRooms;
