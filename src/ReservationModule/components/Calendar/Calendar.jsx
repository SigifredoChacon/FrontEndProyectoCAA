import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameWeek, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlot from './TimeSlot.jsx';
import PropTypes from 'prop-types';
import { getReservationsByCubicleIdAndWeek } from "../../services/reservationService.jsx";

const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'];

const Calendar = ({ selectedCubicleId, onReservationsChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [existingReservations, setExistingReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i));

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const startDate = format(startOfSelectedWeek, 'yyyy-MM-dd');
                const endDate = format(addDays(startOfSelectedWeek, 6), 'yyyy-MM-dd');
                const response = await getReservationsByCubicleIdAndWeek(selectedCubicleId, startDate, endDate);

                const formattedReservations = response.map(reservation => ({
                    ...reservation,
                    day: new Date(reservation.Fecha),
                }));

                setExistingReservations(formattedReservations);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        if (selectedCubicleId) {
            fetchReservations();
        }

    }, [selectedCubicleId, startOfSelectedWeek]);

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value + 'T00:00:00');

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
        const currentTime = new Date(`1970-01-01T${time}:00`);
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
            return 'reserved';
        }

        const reservation = reservations.find(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );

        return reservation ? reservation.status : 'available';
    };

    return (
        <div className="calendar max-w-full p-4">
            <div className="mb-5 flex flex-col items-center">
                <label className="text-lg mb-2 font-bold text-gray-800">
                    Selecciona una fecha:
                </label>
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="p-2 text-base rounded border border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:outline-none"
                    disabled={reservations.length > 0 && selectedDay !== null}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse bg-gray-100 rounded-lg shadow-md mt-5 text-xs sm:text-sm lg:text-base">
                    <thead>
                    <tr>
                        <th></th>
                        {daysOfWeek.map((day, index) => (
                            <th
                                key={index}
                                className="p-3 border border-gray-200 bg-pantone-blue text-white font-bold uppercase text-center"
                            >
                                {format(day, 'EEEE dd/MM', { locale: es })}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {timeSlots.map((time, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="p-3 border border-gray-200 font-bold bg-gray-200 text-center">
                                {time}
                            </td>
                            {daysOfWeek.map((day, colIndex) => {
                                const isPastDate = day < startOfDay(new Date());
                                return (
                                    <td key={colIndex} className="p-3 border border-gray-200 text-center">
                                        <TimeSlot
                                            day={day}
                                            time={time}
                                            isReserved={isReserved(day, time)}
                                            onReserve={handleReserve}
                                            disabled={isReserved(day, time) === 'reserved' || isPastDate || (selectedDay && selectedDay.getTime() !== day.getTime())}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

Calendar.propTypes = {
    selectedCubicleId: PropTypes.number.isRequired,
    onReservationsChange: PropTypes.func.isRequired,
};

export default Calendar;
