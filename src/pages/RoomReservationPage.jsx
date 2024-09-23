import React, {useEffect, useState} from "react";
import CalendarRooms from "../components/Calendar/CalendarRooms.jsx";
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuthContext} from "../hooks/useAuthContext.js";
import {useRoomReservationEdit} from "../hooks/useRoomReservationEdit.js";
import {createReservation} from "../services/reservationService.jsx";
import {getResources} from "../services/resourcesService.jsx";


const initialRoomReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idSala: 0,
    idUsuario: 0,
    observaciones: '',
    refrigerio: false,
    idRecursos: [],
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


export function RoomReservationPage() {
    const location = useLocation();
    const {selectedRoom} = location.state || {}; // Recupera la sala desde el estado
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

            // Agregar el recurso seleccionado a selectedResources
            setSelectedResources([...selectedResources, selectedRecurso]);

            // Filtrar el recurso seleccionado de la lista de resources
            const updatedResources = resources.filter(
                (recurso) => recurso.idRecursos !== selectedRecursoId
            );
            setResources(updatedResources);
        }
    }

    const handleRemoveResource = (recurso) => {
        // Eliminar el recurso de selectedResources
        const updatedSelectedResources = selectedResources.filter(
            (r) => r.idRecursos !== recurso.idRecursos
        );
        setSelectedResources(updatedSelectedResources);

        // Agregar el recurso de vuelta a resources
        setResources([...resources, recurso]);
    }

    const handleSnackChange = (event) => {
        const value = event.target.value === "si";
        setSnack(value); // true si el usuario selecciona "Sí", false si selecciona "No"
    }

    const handleObservationsChange = (event) => {
        setObservations(event.target.value); // Actualiza el estado con el texto de observaciones
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
        handleAddRoomReservation();

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

                selectedDay.setDate(selectedDay.getDate() + 1);

                // Construir la fecha en formato 'YYYY-MM-DD'
                const year = selectedDay.getFullYear();
                const month = String(selectedDay.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
                const day = String(selectedDay.getDate()).padStart(2, '0');
                const fechaReserva = `${year}-${month}-${day}`;

                console.log("Fecha a enviar:", fechaReserva); // Verificar la fecha que se va a enviar
                console.log("Hora inicio:", horaInicio); // Verificar la hora de inicio
                console.log("Hora fin:", horaFinIncremented); // Verificar la hora de fin

                const RoomReservationToCreate = {
                    ...reservation,
                    fecha: fechaReserva, // Convertir la fecha a formato YYYY-MM-DD
                    horaInicio: horaInicio, // Guardar como string 'HH:mm'
                    horaFin: horaFinIncremented, // Guardar como string 'HH:mm'
                    idRecursos: selectedResources.map((recurso) => recurso.idRecursos), // Añadir recursos seleccionados
                    refrigerio: snack, // Guardar el estado de refrigerio
                    observaciones: observations, // Guardar las observaciones ingresadas
                };

                console.log(RoomReservationToCreate); // Verificar la información a enviar

                await createReservation(RoomReservationToCreate);
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }

        handleRoomReservationCreated();
        setReservation(initialRoomReservationState);
    };

    return (
        <div className="p-8 max-w-full mx-auto">
            {/* Contenedor Principal */}
            <div className="flex flex-col md:flex-row items-start justify-start">
                {/* Imagen y Descripción */}
                <div className="flex-shrink-0 md:w-5/12 p-4 mt-8">
                    {/* Título de la Sala */}
                    <div className="text-center text-2xl font-bold mb-4 md:mb-2">
                        {selectedRoom.Nombre}
                    </div>
                    <div className="w-full h-full overflow-hidden"> {/* Contenedor de la imagen con tamaño fijo */}
                        <img
                            src={selectedRoom.imageUrl}
                            alt={selectedRoom.Nombre}
                            className="w-full h-full object-contain rounded-lg max-w-full max-h-full"
                        />
                    </div>

                    {/* Descripción */}
                    <strong className="mt-8 mb-4 block">Descripción de la sala:</strong> {/* Ajuste de márgenes */}
                    <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                        {selectedRoom.Descripcion}
                    </div>

                    {/* Restricciones */}
                    {selectedRoom.Restricciones && (
                        <>
                            <strong className="mt-8 mb-4 block">Restricciones:</strong> {/* Ajuste de márgenes */}
                            <div
                                className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                                {selectedRoom.Restricciones}
                            </div>
                        </>
                    )}
                </div>

                {/* Calendario y Controles */}
                <div className="flex-grow md:w-6/10 p-4">
                    {/* Calendario */}
                    <div className="bg-white w-full shadow-md rounded-lg p-4 mb-4 h-full">
                        <CalendarRooms selectedRoomId={selectedRoom.idSala} onReservationsChange={handleReservationsChange}/>
                    </div>

                    {/* Refrigerio y Recursos */}
                    <div className="flex flex-col md:flex-row mb-4">
                        <div className="md:w-1/2 bg-gray-200 p-4 rounded-lg mb-4 md:mb-0 md:mr-2">
                            <label className="block mb-2 font-bold">Refrigerio</label>
                            <div>
                                <label className="mr-4">
                                    <input type="radio" name="refrigerio" value="si" onChange={handleSnackChange} className="mr-2"/>
                                    Sí
                                </label>
                                <label>
                                    <input type="radio" name="refrigerio" value="no" onChange={handleSnackChange} className="mr-2"/>
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gray-200 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700">
                                Recursos Disponibles
                            </label>
                            <select
                                name="idRecursos"
                                id="idRecursos"
                                value=""
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

                    {/* Mostrar Recursos Seleccionados */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Recursos Seleccionados:</h4>
                        {selectedResources.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedResources.map((recurso) => (
                                    <li key={recurso.idRecursos}>
                                        <button
                                            onClick={() => handleRemoveResource(recurso)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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

                    {/* Observaciones */}
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <textarea
                            className="w-full p-2 rounded-md border border-gray-300"
                            rows="4"
                            placeholder="Observaciones"
                            onChange={handleObservationsChange}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <button onClick={handleRoomReservationCreated} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                            Cancelar
                        </button>
                        <button onClick={handleCreateRoomReservation}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
