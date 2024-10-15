import React, {useEffect, useRef, useState} from "react";
import CalendarRooms from "../components/Calendar/CalendarRooms.jsx";
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {useAuthContext} from "../hooks/useAuthContext.js";
import {useRoomReservationEdit} from "../hooks/useRoomReservationEdit.js";
import {createReservation} from "../services/reservationService.jsx";
import {getResources} from "../services/resourcesService.jsx";
import UserExternalFormCreate from "../components/User/UserExternalFormCreate.jsx";
import Swal from "sweetalert2";
import ReservationForUser from "../components/Reservations/ReservationForUser.jsx";

const initialRoomReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idSala: 0,
    idUsuario: 0,
    observaciones: '',
    refrigerio: false,
    idRecursos: [],
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


export function RoomReservationPage() {
    const {role} = useAuthContext();
    const location = useLocation();
    const {selectedRoom} = location.state || {};
    const {user} = useAuthContext();
    initialRoomReservationState.idUsuario = user;
    initialRoomReservationState.idSala = selectedRoom.idSala;
    const {handleEditRoomReservation, handleRoomReservationUpdated} = useRoomReservationEdit();
    const [reservation, setReservation] = useState(initialRoomReservationState);
    const [reservations, setReservations] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const [snack, setSnack] = useState(false);
    const [observations, setObservations] = useState('');
    const navigate = useNavigate();
    const idExternalRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUserSearchedOpen, setIsModalUserSearchedOpen] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los recursos:', error);
        }
    }

    const handleChangeResource = (event) => {
        const selectedRecursoId = parseInt(event.target.value, 10);

        if (selectedRecursoId) {
            const selectedRecurso = resources.find(
                (recurso) => recurso.idRecursos === selectedRecursoId
            );

            setSelectedResources([...selectedResources, selectedRecurso]);

            const updatedResources = resources.filter(
                (recurso) => recurso.idRecursos !== selectedRecursoId
            );
            setResources(updatedResources);
        }
    }

    const handleRemoveResource = (recurso) => {
        const updatedSelectedResources = selectedResources.filter(
            (r) => r.idRecursos !== recurso.idRecursos
        );
        setSelectedResources(updatedSelectedResources);

        setResources([...resources, recurso]);
    }

    const handleSnackChange = (event) => {
        const value = event.target.value === "si";
        setSnack(value);
    }

    const handleObservationsChange = (event) => {
        setObservations(event.target.value);
    }

    const handleReservationsChange = (newReservations) => {
        setReservations(newReservations);
    };

    const handleAddRoomReservation = () => {
        handleEditRoomReservation(null);
    };

    const handleRoomReservationCreated = () => {
        handleRoomReservationUpdated();

        setReservation(initialRoomReservationState);
        setReservations([]);
        navigate('/');
    };

    const handleCreateRoomReservation = async () => {
        if (!user) {
            Swal.fire({
                title: '¡Tienes que estar registrado!',
                text: 'Para poder realizar una reservación, por favor, inicia sesión 🤗',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',  // Texto del botón
            });
            return;
        }

        handleAddRoomReservation();


        const timeSlots = reservations
            .map(reservation => reservation.time)
            .sort((a, b) => {
                const timeA = new Date(`1970-01-01T${a}:00`);
                const timeB = new Date(`1970-01-01T${b}:00`);
                return timeA - timeB;
            });

        const groupedTimes = groupConsecutiveTimes(timeSlots);

        // Verifica si tienes al menos una reserva en `reservations`
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

                    await makeRoomReservation(groupedTimes, selectedDay, 0);
                } else {

                    console.log("Reserva cancelada por el usuario");

                }
            });
        } else {

            await makeRoomReservation(groupedTimes, selectedDay, 1);
        }
    };

// Nueva función para hacer la reserva
    const makeRoomReservation = async (groupedTimes, selectedDay, estado) => {
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

                const RoomReservationToCreate = {
                    ...reservation,
                    fecha: fechaReserva,
                    horaInicio: horaInicio,
                    horaFin: horaFinIncremented,
                    idRecursos: selectedResources.map((recurso) => recurso.idRecursos),
                    refrigerio: snack,
                    observaciones: observations,
                    estado: estado, // Estado de la reserva (0 para pendiente, 1 para aprobada)
                };

                console.log(RoomReservationToCreate);

                await createReservation(RoomReservationToCreate);
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }

        handleRoomReservationCreated(); // Navega al home u otra vista una vez creada la reserva
        setReservation(initialRoomReservationState); // Reiniciar estado de la reserva
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

            // Navegar de vuelta a la página de reservas, manteniendo la información de la sala
            navigate('/reservationsRoom', { state: { selectedRoom } });
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
            navigate('/reservationsRoom', { state: { selectedRoom } });
        } else {
            console.warn("Se intentó asignar un ID externo undefined.");
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-full mx-auto overflow-x-hidden">
            <Routes>
                <Route path="createExternalUser" element={<UserExternalFormCreate onUserCreated={handleUserCreated} />} />
                <Route path="reserveUser" element={<ReservationForUser onUserSearched={handleUserSearched} />} />
            </Routes>
            <button
                onClick={() => navigate('/allRoomReservation')}
                className="hidden sm:block absolute top-20 left-2 p-2 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>


            <div className="flex flex-col md:flex-row items-start justify-start">
                <div className="flex-shrink-0 w-full md:w-5/12 p-4 mt-8">
                    <div className="text-center text-2xl font-bold mb-4">{selectedRoom.Nombre}</div>
                    <div className="w-full h-full overflow-hidden">
                        <img
                            src={selectedRoom.imageUrl}
                            alt={selectedRoom.Nombre}
                            className="w-full h-full object-contain rounded-lg max-w-full"
                        />
                    </div>
                    <strong className="mt-8 mb-4 block">Descripción de la sala:</strong>
                    <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                        {selectedRoom.Descripcion}
                    </div>
                    {selectedRoom.Restricciones && (
                        <>
                            <strong className="mt-8 mb-4 block">Restricciones:</strong>
                            <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                                {selectedRoom.Restricciones}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex-grow w-full md:w-7/12 p-4">
                    <div className="bg-white w-full max-w-full mx-auto shadow-md rounded-lg p-4 mb-4 h-full sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
                        <CalendarRooms
                            selectedRoomId={selectedRoom.idSala}
                            onReservationsChange={handleReservationsChange}
                        />
                    </div>

                    {user && (
                        <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-4">
                            {(!(role === 'Estudiante') && role && !(role === 'Externo')) && (
                                <div className="w-full md:w-1/2 bg-gray-100 p-3 rounded-lg shadow-sm">
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">Refrigerio</label>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="refrigerio"
                                                value="si"
                                                onChange={handleSnackChange}
                                                className="mr-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            Sí
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="refrigerio"
                                                value="no"
                                                onChange={handleSnackChange}
                                                className="mr-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div className="w-full md:w-1/2 bg-gray-100 p-3 rounded-lg shadow-sm">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Recursos Disponibles</label>
                                <select
                                    name="idRecursos"
                                    id="idRecursos"
                                    onChange={handleChangeResource}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Seleccione un Recurso</option>
                                    {resources.map((recurso) => (
                                        <option key={recurso.idRecursos} value={recurso.idRecursos}>
                                            {recurso.Nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {user && (
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Recursos Seleccionados:</h4>
                            {selectedResources.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedResources.map((recurso) => (
                                        <li key={recurso.idRecursos}>
                                            <button
                                                onClick={() => handleRemoveResource(recurso)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full sm:w-auto"
                                            >
                                                {recurso.Nombre} &times;
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No se han seleccionado recursos.</p>
                            )}
                        </div>
                    )}

                    {user && (
                        <div className="bg-gray-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Observaciones</h4>
                            <textarea
                                className="w-full p-2 rounded-md border border-gray-300"
                                rows="4"
                                placeholder="Observaciones"
                                onChange={handleObservationsChange}
                            />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                        {(!(role === 'Estudiante') && role && !(role === 'Externo') && !(role === 'Profesor')) && (
                            <button
                                onClick={handleCreateUserReservation}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-all w-full sm:w-auto"
                            >
                                Reservar por Usuario
                            </button>
                        )}
                        {(!(role === 'Estudiante') && role && !(role === 'Externo') && !(role === 'Profesor')) && (
                            <button
                                onClick={handleCreateExternalReservation}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-all w-full sm:w-auto"
                            >
                                Reservar Externo
                            </button>
                        )}
                        <button
                            onClick={handleRoomReservationCreated}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                        {user && (
                            <button
                                onClick={handleCreateRoomReservation}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all w-full sm:w-auto"
                            >
                                Reservar
                            </button>
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