import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlot from './TimeSlot';
import PropTypes from 'prop-types';

const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const Calendar = ({ onReservationsChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i));

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        const newWeekStart = startOfWeek(newDate, { weekStartsOn: 1 });

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
        const reservation = reservations.find(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );
        return reservation ? reservation.status : 'available';
    };

    return (
        <div className="calendar">
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <label style={{
                    fontSize: '18px',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    Selecciona una fecha:
                </label>
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    style={{
                        padding: '8px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        color: '#333',
                        cursor: 'default',
                        outline: 'none',
                        boxShadow: 'none',
                        transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #4CAF50'}
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                    disabled={reservations.length > 0 && selectedDay !== null} // Deshabilita si hay selección
                />
            </div>

            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                marginTop: '20px',
            }}>
                <thead>
                <tr>
                    <th></th>
                    {daysOfWeek.map((day, index) => (
                        <th key={index} style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            backgroundColor: '#00289b',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}>
                            {format(day, 'EEEE dd/MM', { locale: es })}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((time, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            width: '100px',
                            textAlign: 'center',
                        }}>{time}</td>
                        {daysOfWeek.map((day, colIndex) => (
                            <td key={colIndex} style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                transition: 'background-color 0.3s ease',
                                width: '100px',
                            }}>
                                <TimeSlot
                                    day={day}
                                    time={time}
                                    isReserved={isReserved(day, time)}
                                    onReserve={handleReserve}
                                    disabled={selectedDay && selectedDay.getTime() !== day.getTime()}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

Calendar.propTypes = {
    onReservationsChange: PropTypes.func.isRequired,
};

export default Calendar;
