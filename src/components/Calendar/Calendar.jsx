// src/components/Calendar.js
import React, { useState } from 'react';
import TimeSlot from './TimeSlot';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const Calendar = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null); // Nuevo estado para rastrear el día seleccionado

    // Alterna la reserva de un intervalo de tiempo (reservado <-> disponible)
    const handleReserve = (day, time) => {
        const reservationIndex = reservations.findIndex(
            (reservation) => reservation.day === day && reservation.time === time
        );

        if (reservationIndex !== -1) {
            // Si ya está reservado, eliminar la reserva
            const newReservations = reservations.filter(
                (reservation) => !(reservation.day === day && reservation.time === time)
            );
            setReservations(newReservations);

            // Si la reserva eliminada es la última del día seleccionado, deseleccionar el día
            if (newReservations.every(reservation => reservation.day !== selectedDay)) {
                setSelectedDay(null);
            }
        } else {
            // Si no está reservado y no hay otro día seleccionado, agregar la reserva
            if (!selectedDay || selectedDay === day) {
                setReservations([...reservations, { day, time, status: 'selected' }]);
                setSelectedDay(day); // Establecer el día seleccionado
            }
        }
    };

    const isReserved = (day, time) => {
        const reservation = reservations.find(
            (reservation) => reservation.day === day && reservation.time === time
        );
        if (reservation) {
            return reservation.status; // 'selected' o 'reserved'
        }
        return 'available'; // Disponible si no está reservado
    };

    // Estilos de la tabla y las celdas
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#f5f5f5', // Fondo de la tabla
        borderRadius: '8px', // Bordes redondeados de la tabla
        overflow: 'hidden', // Para que los bordes redondeados se apliquen correctamente
        marginTop: '20px',
    };

    const cellStyle = {
        padding: '12px',
        border: '1px solid #ddd',
        textAlign: 'center',
        position: 'relative', // Posición relativa para permitir que el botón se posicione absolutamente dentro
    };

    const headerCellStyle = {
        ...cellStyle,
        backgroundColor: '#4CAF50', // Fondo del encabezado
        color: 'white', // Texto blanco para el encabezado
        fontWeight: 'bold',
    };

    return (
        <div className="calendar">
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={{ ...headerCellStyle, backgroundColor: 'transparent' }}></th> {/* Celda vacía sin fondo */}
                    {daysOfWeek.map((day, index) => (
                        <th key={index} style={headerCellStyle}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((time, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={headerCellStyle}>{time}</td>
                        {daysOfWeek.map((day, colIndex) => (
                            <td key={colIndex} style={cellStyle}>
                                <TimeSlot
                                    day={day}
                                    time={time}
                                    isReserved={isReserved(day, time)}
                                    onReserve={handleReserve}
                                    disabled={selectedDay && selectedDay !== day} // Deshabilitar si hay un día seleccionado que no es este
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

export default Calendar;
