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
        <div className="calendar w-full">

            <div className="flex justify-center mb-5">
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="
                inline-flex items-center rounded-lg border border-slate-300 bg-white
                px-3 py-2 text-sm shadow-sm
                focus:border-pantone-blue focus:ring-pantone-blue
            "
                    disabled={reservations.length > 0 && selectedDay !== null}
                />
            </div>


            <div className="w-full overflow-hidden">
                <table className="w-full border-separate border-spacing-0 rounded-2xl overflow-hidden bg-white shadow-sm text-[10px] sm:text-xs">
                    <thead className="sticky top-0 z-10">
                    <tr>

                        <th className="w-12 sm:w-14 bg-white" />
                        {daysOfWeek.map((day, index) => (
                            <th
                                key={index}
                                className="
                                px-1 py-2 sm:px-2 sm:py-3
                                border border-pantone-blue/70
                                bg-pantone-blue text-white font-bold uppercase text-center
                                first:rounded-tl-2xl last:rounded-tr-2xl align-middle
                            "
                            >
                                {/* Solo día y fecha numérica para ahorrar espacio */}
                                <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] sm:text-[10px] opacity-90">
                                    {format(day, 'EEE', { locale: es })}
                                </span>
                                    <span className="text-xs sm:text-sm font-bold">
                                    {format(day, 'dd/MM', { locale: es })}
                                </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {timeSlots.map((time, rowIndex) => (
                        <tr key={rowIndex} className="even:bg-slate-50">

                            <td className="
                            sticky left-0 z-10 bg-white even:bg-slate-50
                            text-center font-semibold text-slate-700
                            px-1 py-1.5 sm:px-2 sm:py-2 border border-slate-200
                            text-[10px] sm:text-xs
                        ">
                                {time}
                            </td>

                            {daysOfWeek.map((day, colIndex) => {
                                const isPastDate = day < startOfDay(new Date());
                                const state = isReserved(day, time);

                                return (
                                    <td
                                        key={colIndex}
                                        className="px-0.5 py-1 sm:px-1 sm:py-1.5 text-center align-middle border border-slate-200"
                                    >
                                        <TimeSlot
                                            day={day}
                                            time={time}
                                            isReserved={state}
                                            onReserve={handleReserve}
                                            disabled={
                                                state === 'reserved' ||
                                                isPastDate ||
                                                (selectedDay && selectedDay.getTime() !== day.getTime())
                                            }
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
