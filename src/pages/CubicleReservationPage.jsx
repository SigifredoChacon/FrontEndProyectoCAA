import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCubicleReservationEdit } from "../hooks/useCubicleReservationEdit.js";
import { useCubicleEdit } from "../hooks/useCubicleEdit.js";
import Calendar from '../components/Calendar/Calendar.jsx';
import { getCubicles } from '../services/cubicleService.jsx';
import { createReservation } from "../services/reservationService.jsx";

const initialCubicleReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idCubiculo: 0,
    idUsuario: 1235432,
    observaciones: '',
    refrigerio: false,
};

function groupConsecutiveTimes(timeSlots) {
    const grouped = [];
    let currentGroup = [];

    for (let i = 0; i < timeSlots.length; i++) {
        if (currentGroup.length === 0) {
            currentGroup.push(timeSlots[i]);
        } else {
            const lastTime = currentGroup[currentGroup.length - 1];
            const currentTime = timeSlots[i];

            const lastDate = new Date(`1970-01-01T${lastTime}:00`);
            const currentDate = new Date(`1970-01-01T${currentTime}:00`);

            if (currentDate - lastDate === 3600000) { // Diferencia de 1 hora
                currentGroup.push(currentTime);
            } else {
                grouped.push(currentGroup);
                currentGroup = [currentTime];
            }
        }
    }

    if (currentGroup.length > 0) {
        grouped.push(currentGroup);
    }

    return grouped;
}

function CubiclesReservationPage() {
    const { handleEditCubicle, handleCubicleUpdated } = useCubicleEdit();
    const [isCreating, setIsCreating] = useState(false);
    const { handleEditCubicleReservation, handleCubicleReservationUpdated } = useCubicleReservationEdit();
    const [reservation, setReservation] = useState(initialCubicleReservationState);
    const [reservations, setReservations] = useState([]);
    const [cubicles, setCubicles] = useState([]);
    const [selectedCubicleR, setSelectedCubicle] = useState(null);
    const [calendarKey, setCalendarKey] = useState(0); // Clave para forzar la recarga del calendario

    const navigate = useNavigate();

    useEffect(() => {
        fetchCubicles();
    }, []);

    const fetchCubicles = async () => {
        try {
            const data = await getCubicles();
            setCubicles(data);
        } catch (error) {
            console.error('Error al obtener los cubículos:', error);
        }
    };

    const handleReservationsChange = (newReservations) => {
        setReservations(newReservations);
        console.log('Lista de reservas actualizada:', newReservations);
        console.log(reservations);
    };

    const handleCreateCubicleReservation = async () => {
        handleAddCubicleReservation();

        const timeSlots = reservations
            .map(reservation => reservation.time)
            .sort((a, b) => {
                const timeA = new Date(`1970-01-01T${a}:00`);
                const timeB = new Date(`1970-01-01T${b}:00`);
                return timeA - timeB;
            });

        const groupedTimes = groupConsecutiveTimes(timeSlots);

        for (let group of groupedTimes) {
            const horaInicio = group[0];
            const horaFin = group[group.length - 1];
            const [hour, minute] = horaFin.split(':');
            const horaFinIncremented = `${String(parseInt(hour, 10) + 1).padStart(2, '0')}:${minute}`;

            try {
                const selectedDay = reservations[0].day;
                const fechaReserva = new Date(selectedDay).toLocaleDateString('en-CA', {
                    timeZone: 'America/Costa_Rica',
                });
                console.log('Fecha de la reserva:', fechaReserva);
                // Formatear la fecha ajustada a YYYY-MM-DD
                const cubicleReservationToCreate = {
                    ...reservation,
                    idCubiculo: selectedCubicleR.idCubiculo,
                    fecha: fechaReserva, // Convertir la fecha a formato YYYY-MM-DD
                    horaInicio: horaInicio, // Guardar como string 'HH:mm'
                    horaFin: horaFinIncremented, // Guardar como string 'HH:mm'
                };

                await createReservation(cubicleReservationToCreate);
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }

        handleCubicleReservationCreated();
        setReservation(initialCubicleReservationState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateCubicleReservation();
    };

    const handleCubicleSelect = (cubicle) => {
        setSelectedCubicle(cubicle);
        setReservations([]); // Reinicia las reservaciones
        setCalendarKey(prevKey => prevKey + 1); // Cambia la clave para forzar la recarga del calendario
    };

    const handleCubicleReservationCreated = () => {
        handleCubicleUpdated();
        handleCubicleReservationUpdated();
        setIsCreating(false);

        setReservation(initialCubicleReservationState);
        setReservations([]);
        setSelectedCubicle(null);
        setCalendarKey(prevKey => prevKey + 1); // Forzar la recarga del calendario
        navigate('/');
    };

    const handleAddCubicleReservation = () => {
        setIsCreating(true);
        handleEditCubicle(null);
        handleEditCubicleReservation(null);
    };

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', padding: '20px' }}>
                {/* Barra lateral con la lista de cubículos */}
                <div style={{
                    width: '20%',
                    marginRight: '20px',
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        marginBottom: '20px'
                    }}>Cubículos Disponibles</h3>
                    <ul style={{
                        listStyleType: 'none',
                        padding: '0',
                        margin: '0'
                    }}>
                        {cubicles.map((cubicle) => (
                            <li
                                key={cubicle.idCubiculo}
                                onClick={() => handleCubicleSelect(cubicle)}
                                style={{
                                    padding: '10px 20px',
                                    margin: '10px 0',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    backgroundColor: selectedCubicleR?.idCubiculo === cubicle.idCubiculo ? '#ddd' : '#fff',
                                    boxShadow: selectedCubicleR?.idCubiculo === cubicle.idCubiculo ? 'inset 0 0 10px rgba(0, 0, 0, 0.2)' : 'none'
                                }}
                            >
                                {cubicle.Nombre}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Vista del calendario */}
                <div style={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            margin: '0'
                        }}>
                            {selectedCubicleR ? `Reservar Cubículo: ${selectedCubicleR.Nombre}` : 'Seleccionar Cubículo'}
                        </h2>
                        <div>
                            <button
                                onClick={handleCubicleReservationCreated}
                                style={{
                                padding: '10px 20px',
                                marginRight: '10px',
                                backgroundColor: '#ff4d4d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>Cancelar
                            </button>
                            <button
                                onClick={handleCreateCubicleReservation}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4caf50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>Reservar
                            </button>
                        </div>
                    </div>
                    {selectedCubicleR ? (
                        <Calendar
                            key={calendarKey} // Forzar recarga del calendario
                            onReservationsChange={handleReservationsChange}
                        />
                    ) : (
                        <p>Por favor, selecciona un cubículo para continuar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CubiclesReservationPage;
