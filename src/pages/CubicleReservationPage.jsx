import React, {useState, useEffect, useRef} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import { useCubicleReservationEdit } from "../hooks/useCubicleReservationEdit.js";
import { useCubicleEdit } from "../hooks/useCubicleEdit.js";
import Calendar from '../components/Calendar/Calendar.jsx';
import { getCubicles } from '../services/cubicleService.jsx';
import { createReservation } from "../services/reservationService.jsx";
import {useAuthContext} from "../hooks/useAuthContext.js";
import UserExternalFormCreate from "../components/User/UserExternalFormCreate.jsx";
import Swal from "sweetalert2";
import ReservationForUser from "../components/Reservations/ReservationForUser.jsx";


const initialCubicleReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idCubiculo: 0,
    idUsuario: 0,
    observaciones: '',
    refrigerio: false,
    estado: true,
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

            if (currentDate - lastDate === 3600000) {
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
    const {role} = useAuthContext();
    const {user}=useAuthContext();
    initialCubicleReservationState.idUsuario=user;
    const { handleEditCubicle, handleCubicleUpdated } = useCubicleEdit();
    const { handleEditCubicleReservation, handleCubicleReservationUpdated } = useCubicleReservationEdit();
    const [isCreating, setIsCreating] = useState(false);
    const [reservation, setReservation] = useState(initialCubicleReservationState);
    const [reservations, setReservations] = useState([]);
    const [cubicles, setCubicles] = useState([]);
    const [selectedCubicleR, setSelectedCubicle] = useState(null);
    const [calendarKey, setCalendarKey] = useState(0);
    const idExternalRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUserSearchedOpen, setIsModalUserSearchedOpen] = useState(false);

    const navigate = useNavigate();



    useEffect(() => {
        fetchCubicles();


    }, []);

    const fetchCubicles = async () => {
        try {
            const data = await getCubicles();
            const filteredData = data.filter(cubicle => cubicle.Estado === 1);
            setCubicles(filteredData);
        } catch (error) {
            console.error('Error al obtener los cubículos:', error);
        }
    };

    const handleReservationsChange = (newReservations) => {
        setReservations(newReservations);
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

        if (reservations.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'No hay horarios seleccionados.',
                icon: 'error',
            });
            return;
        }


        const selectedDay = new Date(reservations[0].day);

        const isSaturday = selectedDay.getDay() === 6;

        selectedDay.setDate(selectedDay.getDate() + 1);


        if (isSaturday) {
            Swal.fire({
                title: '¡Reserva en sábado!',
                text: 'Las reservas para los sábados necesitan aprobación de la administración. ¿Desea continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, proceder con la reserva con `estado: 0`
                    await makeCubicleReservation(groupedTimes, selectedDay, 0); // 0 indica que está pendiente de aprobación
                } else {
                    // Si cancela, no se hace nada
                    console.log("Reserva cancelada por el usuario");
                }
            });
        } else {
            // Si no es sábado, proceder con la reserva normalmente (estado 1)
            await makeCubicleReservation(groupedTimes, selectedDay, 1); // 1 indica que está activa
        }

    };

    const makeCubicleReservation = async (groupedTimes, selectedDay, status) => {
        for (let group of groupedTimes) {
            const horaInicio = group[0];
            const horaFin = group[group.length - 1];
            const [hour, minute] = horaFin.split(':');
            const horaFinIncremented = `${String(parseInt(hour, 10) + 1).padStart(2, '0')}:${minute}`;

            try {
                const year = selectedDay.getFullYear();
                const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDay.getDate()).padStart(2, '0');
                const fechaReserva = `${year}-${month}-${day}`;

                console.log("Fecha a enviar:", fechaReserva);
                console.log("Hora inicio:", horaInicio);
                console.log("Hora fin:", horaFinIncremented);


                const cubicleReservationToCreate = {
                    ...reservation,
                    idCubiculo: selectedCubicleR.idCubiculo,
                    fecha: fechaReserva,
                    horaInicio: horaInicio,
                    horaFin: horaFinIncremented,
                    estado: status,
                };

                await createReservation(cubicleReservationToCreate);
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }

        handleCubicleReservationCreated();
        setReservation(initialCubicleReservationState);
    }

    const handleSubmit = (e) => {
        if(!user) {
            Swal.fire({
                title: '¡Tienes que estar registrado!',
                text: 'Para poder realizar una reservación, por favor, inicia sesión 🤗',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',  // Texto del botón
            });
            return;
        }
        e.preventDefault();
        handleCreateCubicleReservation();
    };

    const handleCubicleSelect = (cubicle) => {
        setSelectedCubicle(cubicle);
        setReservations([]);
        setCalendarKey(prevKey => prevKey + 1);
    };

    const handleCubicleReservationCreated = () => {
        handleCubicleUpdated();
        handleCubicleReservationUpdated();
        setIsCreating(false);

        setReservation(initialCubicleReservationState);
        setReservations([]);
        setSelectedCubicle(null);
        setCalendarKey(prevKey => prevKey + 1);
        navigate('/');
    };

    const handleAddCubicleReservation = () => {
        setIsCreating(true);
        handleEditCubicle(null);
        handleEditCubicleReservation(null);
    };

    const handleCreateExternalReservation = () => {
        setIsModalOpen(true); // Abrir el modal
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false); // Cerrar el modal
    };


    const handleUserCreated = (idExternal) => {
        if (idExternal !== undefined) {
            idExternalRef.current = parseInt(idExternal, 10);
            console.log("ID externo recibido y almacenado en la referencia:", idExternalRef.current);

            setReservation(prevReservation => ({
                ...prevReservation,
                idUsuario: idExternalRef.current,
            }));

            setIsModalOpen(false); // Cerrar el modal después de crear el usuario
            navigate('/reservationsCubicle');
        } else {
            console.warn("Se intentó asignar un ID externo undefined.");
        }
    };

    //Funcion para el modal de la reservacion para un usuario ya registrado
    const handleCreateUserReservation = () => {
        setIsModalUserSearchedOpen(true); // Abrir el modal
    };

    // Función para cerrar el modal
    const handleCloseModalUser = () => {
        setIsModalUserSearchedOpen(false); // Cerrar el modal
    };


    const handleUserSearched = (idUserSearched) => {
        if (idUserSearched !== undefined) {
            idExternalRef.current = parseInt(idUserSearched, 10);
            console.log("ID externo recibido y almacenado en la referencia:", idExternalRef.current);

            setReservation(prevReservation => ({
                ...prevReservation,
                idUsuario: idExternalRef.current,
            }));

            setIsModalUserSearchedOpen(false); // Cerrar el modal después de crear el usuario
            navigate('/reservationsCubicle');
        } else {
            console.warn("Se intentó asignar un ID externo undefined.");
        }
    };



    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80px',
                    left: '10px',
                    padding: '5px',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" style={{width: '32px', height: '32px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>


            </button>
            <div style={{display: 'flex', flexDirection: 'row', height: '100vh', padding: '20px'}}>
                <Routes>
                    <Route path="createExternalUser"
                           element={<UserExternalFormCreate onUserCreated={handleUserCreated}/>}/>
                    <Route path="reserveUser" element={<ReservationForUser onUserSearched={handleUserSearched}/>}/>
                </Routes>

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

                <div style={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    flexGrow: 1,
                    minHeight: 'min-content'  // Asegura que el contenedor sea lo suficientemente grande como para ajustarse al contenido mínimo
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
                            {(!(role == 'Estudiante') && role && !(role == 'Externo') && !(role == 'Profesor')) && (
                                <button
                                    onClick={handleCreateUserReservation}
                                    style={{
                                        padding: '10px 20px',
                                        marginRight: '10px',
                                        backgroundColor: '#004080',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>

                                    Reservar por Usuario
                                </button>
                            )}
                            {(!(role == 'Estudiante') && role && !(role == 'Externo') && !(role == 'Profesor')) && (
                                <button
                                    onClick={handleCreateExternalReservation}
                                    style={{
                                        padding: '10px 20px',
                                        marginRight: '10px',
                                        backgroundColor: '#004080',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Reservar Externo
                                </button>
                            )}
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
                                onClick={handleSubmit}
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
                    <div style={{flexGrow: 1}}>
                        {selectedCubicleR ? (
                            <Calendar
                                key={calendarKey}
                                onReservationsChange={handleReservationsChange}
                                selectedCubicleId={selectedCubicleR.idCubiculo}
                            />
                        ) : (
                            <p>Por favor, selecciona un cubículo para continuar.</p>
                        )}
                    </div>
                </div>
                {isModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <UserExternalFormCreate onUserCreated={handleUserCreated} onCancel={handleCloseModal}/>
                    </div>
                )}

                {isModalUserSearchedOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <ReservationForUser
                            onUserSearched={handleUserSearched}
                            onCancel={handleCloseModalUser}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CubiclesReservationPage;