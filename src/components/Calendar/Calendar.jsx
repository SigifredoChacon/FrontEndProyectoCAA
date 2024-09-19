import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale español
import TimeSlot from './TimeSlot';

// Constante de intervalos de tiempo
const timeSlots = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    // Manejar el cambio de la fecha seleccionada por el usuario
    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
        setSelectedDay(null); // Limpiar selección al cambiar la fecha
    };

    // Obtener el inicio de la semana basado en la fecha seleccionada
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });

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
                />
            </div>

            {/* Tabla de horario */}
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
                            textTransform: 'uppercase', // Convertir el día a mayúsculas
                        }}>
                            {format(day, 'EEEE dd/MM', { locale: es })} {/* Días en español */}
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
                            width: '100px', // Tamaño uniforme para las celdas de horario
                            textAlign: 'center',
                        }}>{time}</td>
                        {daysOfWeek.map((day, colIndex) => (
                            <td key={colIndex} style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                transition: 'background-color 0.3s ease',
                                width: '100px', // Tamaño uniforme para las celdas de tiempo
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

export default Calendar;
