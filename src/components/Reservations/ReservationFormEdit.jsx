import React, { useEffect, useState } from "react";
import CalendarRooms from "../Calendar/CalendarRooms.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { updateReservation } from "../../services/reservationService.jsx";
import { getResources } from "../../services/resourcesService.jsx";
import { getRoomById } from "../../services/roomService.jsx";
import CalendarRoomsNoEdit from "../Calendar/CalendarRoomsNoEdit.jsx";  // Importa el servicio para obtener la sala

export function ReservationFormEdit({ selectedPersonalReservation, onReservationUpdated }) {
    const location = useLocation();
    const { user } = useAuthContext();
    const [reservation, setReservation] = useState({ ...selectedPersonalReservation });
    const [resources, setResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const [snack, setSnack] = useState(Boolean(selectedPersonalReservation.Refrigerio));
    const [observations, setObservations] = useState(selectedPersonalReservation.Observaciones);
    const [roomDetails, setRoomDetails] = useState(null);
    const navigate = useNavigate();


    const [resourcesLoaded, setResourcesLoaded] = useState(false);

    useEffect(() => {
        fetchResources();
        fetchRoomDetails();
    }, []);

    useEffect(() => {
        if (resources.length > 0 && !resourcesLoaded) {
            loadInitialSelectedResources();
            setResourcesLoaded(true);
        }
    }, [resources, resourcesLoaded]);

    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
        } catch (error) {
            console.error('Error al obtener los recursos:', error);
        }
    };

    const fetchRoomDetails = async () => {
        try {
            const room = await getRoomById(reservation.idSala);

            if (room && room.Imagen && room.Imagen.data) {

                const blob = new Blob([new Uint8Array(room.Imagen.data)], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);

                setRoomDetails({
                    ...room,
                    imageUrl: imageUrl
                });
            } else {
                setRoomDetails(room);
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la sala:', error);
        }
    };



    const loadInitialSelectedResources = () => {
        const selectedResourceIds = reservation.recursos.map(recurso => recurso.idRecurso);


        const initialSelectedResources = resources.filter(recurso =>
            selectedResourceIds.includes(recurso.idRecursos)
        );
        setSelectedResources(initialSelectedResources);

        const updatedResources = resources.filter(recurso =>
            !selectedResourceIds.includes(recurso.idRecursos)
        );


        setResources(updatedResources);
    };

    const handleChangeResource = (event) => {
        const selectedRecursoId = parseInt(event.target.value, 10);
        if (selectedRecursoId) {
            const selectedRecurso = resources.find(
                (recurso) => recurso.idRecursos === selectedRecursoId
            );

            setSelectedResources([...selectedResources, selectedRecurso]);

            // Eliminar el recurso seleccionado de la lista de recursos disponibles
            const updatedResources = resources.filter(
                (recurso) => recurso.idRecursos !== selectedRecursoId
            );
            setResources(updatedResources);
        }
    };


    const handleRemoveResource = (recurso) => {

        const updatedSelectedResources = selectedResources.filter(
            (r) => r.idRecursos !== recurso.idRecursos
        );
        setSelectedResources(updatedSelectedResources);


        const updatedResources = [...resources, recurso].filter((item, index, self) =>
            index === self.findIndex((r) => r.idRecursos === item.idRecursos)
        );
        setResources(updatedResources);
    };

    const handleSnackChange = (event) => {
        const value = event.target.value === "si";
        console.log("Nuevo valor de refrigerio:", value);
        setSnack(value);
    };

    const handleObservationsChange = (event) => {
        setObservations(event.target.value);
    };

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    const handleUpdateRoomReservation = async () => {
        try {
            const updatedReservation = {
                ...reservation,
                idRecursos: selectedResources.map(recurso => recurso.idRecursos),
                refrigerio: snack,
                observaciones: observations,
            };
            const initialReservationLowerCase = convertFirstLetterToLowerCase(selectedPersonalReservation);

            const updatedFields = Object.keys(updatedReservation).reduce((acc, key) => {
                if (updatedReservation[key] !== initialReservationLowerCase[key]) {
                    acc[key] = updatedReservation[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating reservation with data:', updatedFields);
                await updateReservation(updatedReservation.idReservacion, updatedFields);
                onReservationUpdated();
                navigate('/');
            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar la reservación:', error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-full mx-auto overflow-x-hidden">
            <div className="flex flex-col md:flex-row items-start justify-start">
                {/* Contenedor de detalles de la sala */}
                <div className="flex-shrink-0 w-full md:w-5/12 p-4 mt-8">
                    {roomDetails ? (
                        <>
                            <div className="text-center text-2xl font-bold mb-4">{roomDetails.Nombre}</div>
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={roomDetails.imageUrl}
                                    alt={roomDetails.Nombre}
                                    className="w-full h-full object-contain rounded-lg max-w-full"
                                />
                            </div>
                            <strong className="mt-8 mb-4 block">Descripción de la sala:</strong>
                            <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                                {roomDetails.Descripcion}
                            </div>
                            {roomDetails.Restricciones && (
                                <>
                                    <strong className="mt-8 mb-4 block">Restricciones:</strong>
                                    <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                                        {roomDetails.Restricciones}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <p>Cargando detalles de la sala...</p>
                    )}
                </div>

                {/* Contenedor del calendario y opciones */}
                <div className="flex-grow w-full md:w-7/12 p-4">
                    <div className="bg-white w-full max-w-full mx-auto shadow-md rounded-lg p-4 mb-4 sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
                        <CalendarRoomsNoEdit
                            selectedRoomId={reservation.idSala}
                            onReservationsChange={() => {}}
                            editable={false}
                            reservationId={reservation.idReservacion}
                        />
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-4">
                        <div className="w-full md:w-1/2 bg-gray-100 p-3 rounded-lg shadow-sm">
                            <label className="block mb-1 text-sm font-semibold text-gray-700">Refrigerio</label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="refrigerio"
                                        value="si"
                                        onChange={handleSnackChange}
                                        checked={snack === true}
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
                                        checked={snack === false}
                                        className="mr-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 bg-gray-100 p-3 rounded-lg shadow-sm">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Recursos Disponibles</label>
                            <select
                                name="idRecursos"
                                id="idRecursos"
                                value=""
                                onChange={handleChangeResource}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione un Recurso</option>
                                {resources.filter(recurso =>
                                    !selectedResources.some(selected => selected.idRecursos === recurso.idRecursos)
                                ).map(recurso => (
                                    <option key={recurso.idRecursos} value={recurso.idRecursos}>
                                        {recurso.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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

                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Observaciones</h4>
                        <textarea
                            className="w-full p-2 rounded-md border border-gray-300"
                            rows="4"
                            placeholder="Observaciones"
                            onChange={handleObservationsChange}
                            value={observations}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                        <button onClick={() => navigate('/')}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all w-full sm:w-auto">
                            Cancelar
                        </button>
                        <button onClick={handleUpdateRoomReservation}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all w-full sm:w-auto">
                            Actualizar Reservación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ReservationFormEdit;
