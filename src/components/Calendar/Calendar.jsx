// src/components/Calendar.js
import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns'; // Importamos funciones de date-fns
import TimeSlot from './TimeSlot';

// Constante de intervalos de tiempo
const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const Calendar = () => {
    // Estado para la fecha seleccionada (por defecto el día de hoy)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null); // Día actualmente seleccionado

    // Manejar el cambio de la fecha seleccionada por el usuario
    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
        setSelectedDay(null); // Limpiar selección al cambiar la fecha
    };

    // Obtener el inicio de la semana basado en la fecha seleccionada
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Lunes como primer día de la semana

    // Crear los días de la semana basados en la fecha seleccionada
    const daysOfWeek = Array.from({ length: 6 }, (_, i) => addDays(startOfSelectedWeek, i));

    // Función para manejar la reserva
    const handleReserve = (day, time) => {
        const reservationIndex = reservations.findIndex(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );

        if (reservationIndex !== -1) {
            // Si ya está reservado, eliminar la reserva
            const newReservations = reservations.filter(
                (reservation) => !(reservation.day.getTime() === day.getTime() && reservation.time === time)
            );
            setReservations(newReservations);

            // Si la reserva eliminada es la última del día seleccionado, deseleccionar el día
            if (newReservations.every(reservation => reservation.day.getTime() !== selectedDay?.getTime())) {
                setSelectedDay(null);
            }
        } else {
            // Si no está reservado y no hay otro día seleccionado, agregar la reserva
            if (!selectedDay || selectedDay.getTime() === day.getTime()) {
                setReservations([...reservations, { day, time, status: 'selected' }]);
                setSelectedDay(day); // Establecer el día seleccionado
            }
        }
    };

    // Verificar si una franja horaria está reservada
    const isReserved = (day, time) => {
        const reservation = reservations.find(
            (reservation) => reservation.day.getTime() === day.getTime() && reservation.time === time
        );
        if (reservation) {
            return reservation.status; // 'selected' o 'reserved'
        }
        return 'available'; // Disponible si no está reservado
    };

    return (
        <div className="calendar">
            {/* Selector de fecha */}
            <div style={{ marginBottom: '20px' }}>
                <label>Selecciona una fecha: </label>
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')} // Mostrar la fecha seleccionada
                    onChange={handleDateChange}
                />
            </div>

            {/* Tabla de horario */}
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <thead>
                <tr>
                    <th></th> {/* Columna vacía para los horarios */}
                    {daysOfWeek.map((day, index) => (
                        <th key={index} style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {format(day, 'EEEE dd/MM')} {/* Mostrar el día de la semana con la fecha */}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((time, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{time}</td>
                        {daysOfWeek.map((day, colIndex) => (
                            <td key={colIndex} style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <TimeSlot
                                    day={day}
                                    time={time}
                                    isReserved={isReserved(day, time)}
                                    onReserve={handleReserve}
                                    disabled={selectedDay && selectedDay.getTime() !== day.getTime()} // Deshabilitar si hay un día seleccionado que no es este
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
