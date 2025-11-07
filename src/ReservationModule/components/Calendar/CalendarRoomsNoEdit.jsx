import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameWeek, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlotNoEdit from './TimeSlotNoEdit.jsx';
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


                        setSelectedDate(userReservationDate);
                    }
                }
            } catch (error) {
                console.error("Error fetching user reservation:", error);
            }
        };

        fetchUserReservation();
    }, [reservationId]);


    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i));

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

        if (userReservation && startOfDay(userReservation.day).getTime() === startOfDay(day).getTime()) {
            const startTime = new Date(`1970-01-01T${userReservation.HoraInicio}:00`);
            const endTime = new Date(`1970-01-01T${userReservation.HoraFin}:00`);
            if (currentTime >= startTime && currentTime < endTime) {
                return 'userReserved';
            }
        }


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

        return 'available';
    };

    return (
        <div className="calendar w-full">

            <div className="flex justify-center mb-5">
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    disabled={!editable}
                    className="
                inline-flex items-center rounded-lg border border-slate-300 bg-white
                px-3 py-2 text-sm shadow-sm
                focus:border-pantone-blue focus:ring-pantone-blue
                disabled:bg-slate-100 disabled:cursor-not-allowed
            "
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
                                const state = isReserved(day, time);

                                return (
                                    <td
                                        key={colIndex}
                                        className="px-0.5 py-1 sm:px-1 sm:py-1.5 text-center align-middle border border-slate-200"
                                    >
                                        <TimeSlotNoEdit
                                            day={day}
                                            time={time}
                                            isReserved={state}
                                            onReserve={() => {}}
                                            disabled={!editable || state === 'reserved'}
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

CalendarRoomsNoEdit.propTypes = {
    selectedRoomId: PropTypes.number.isRequired,
    onReservationsChange: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    reservationId: PropTypes.number.isRequired,
};

export default CalendarRoomsNoEdit;
