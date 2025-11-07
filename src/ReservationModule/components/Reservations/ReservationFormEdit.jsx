import React, { useEffect, useState } from "react";
import CalendarRooms from "../Calendar/CalendarRooms.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../SecurityModule/hooks/useAuthContext.js";
import { updateReservation } from "../../services/reservationService.jsx";
import { getResources } from "../../services/resourceService.jsx";
import { getRoomById } from "../../services/roomService.jsx";
import CalendarRoomsNoEdit from "../Calendar/CalendarRoomsNoEdit.jsx";
import Swal from "sweetalert2";

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
                await updateReservation(updatedReservation.idReservacion, updatedFields);
                onReservationUpdated();
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado la reservación con éxito',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        navigate('/');
                    }
                });
            } else {
                await Swal.fire({
                    title: '¡Error!',
                    text: 'No se detectaron cambios',
                    icon: 'error',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
            }
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: 'Error al editar la reservación',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };

    return (
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 mt-12 mb-28">

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">


                <aside className="xl:col-span-5">
                    <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        {roomDetails ? (
                            <>

                                <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-5 py-4">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        {roomDetails.Nombre}
                                    </h1>
                                </div>


                                <div className="overflow-hidden">
                                    <img
                                        src={roomDetails.imageUrl}
                                        alt={roomDetails.Nombre}
                                        className="w-full aspect-video lg:aspect-[4/3] object-cover"
                                    />
                                </div>


                                <div className="p-4 sm:p-5">
                                    <div className="space-y-5">
                                        <div>
                                            <h3 className="text-pantone-blue font-semibold">Descripción de la sala</h3>
                                            <p className="mt-2 text-slate-700 leading-relaxed">
                                                {roomDetails.Descripcion}
                                            </p>
                                        </div>

                                        {roomDetails.Restricciones && (
                                            <div>
                                                <h3 className="text-pantone-blue font-semibold">Restricciones</h3>
                                                <p className="mt-2 text-slate-700 leading-relaxed">
                                                    {roomDetails.Restricciones}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 h-1 w-20 rounded-full bg-pantone-red" />
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-slate-500">Cargando detalles de la sala...</p>
                            </div>
                        )}
                    </div>
                </aside>


                <section className="xl:col-span-7">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">

                        <div className="w-full">
                            <CalendarRoomsNoEdit
                                selectedRoomId={reservation.idSala}
                                onReservationsChange={() => {}}
                                editable={false}
                                reservationId={reservation.idReservacion}
                            />
                        </div>


                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <label className="block text-sm font-semibold text-pantone-blue mb-2">Refrigerio</label>
                                <div className="flex items-center gap-5">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="refrigerio"
                                            value="si"
                                            onChange={handleSnackChange}
                                            checked={snack === true}
                                            className="h-4 w-4 text-pantone-blue focus:ring-pantone-blue border-slate-300"
                                        />
                                        <span>Sí</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="refrigerio"
                                            value="no"
                                            onChange={handleSnackChange}
                                            checked={snack === false}
                                            className="h-4 w-4 text-pantone-blue focus:ring-pantone-blue border-slate-300"
                                        />
                                        <span>No</span>
                                    </label>
                                </div>
                            </div>


                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <label className="block text-sm font-semibold text-pantone-blue mb-2">
                                    Recursos Disponibles
                                </label>
                                <select
                                    name="idRecursos"
                                    id="idRecursos"
                                    value=""
                                    onChange={handleChangeResource}
                                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 shadow-sm focus:border-pantone-blue focus:ring-pantone-blue text-sm"
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


                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="font-semibold text-pantone-blue mb-3">Recursos seleccionados</h4>
                            {selectedResources.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedResources.map((recurso) => (
                                        <button
                                            key={recurso.idRecursos}
                                            onClick={() => handleRemoveResource(recurso)}
                                            className="inline-flex items-center gap-2 rounded-full border border-pantone-blue/20 bg-pantone-blue-50 px-3 py-1.5 text-sm text-pantone-blue hover:bg-pantone-blue/10 transition"
                                            title="Quitar recurso"
                                        >
                                            {recurso.Nombre} <span aria-hidden>&times;</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No se han seleccionado recursos.</p>
                            )}
                        </div>


                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100 p-4">
                            <label className="font-semibold text-pantone-blue mb-2 block">Observaciones</label>
                            <textarea
                                rows="4"
                                placeholder="Observaciones"
                                onChange={handleObservationsChange}
                                value={observations}
                                className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-pantone-blue focus:ring-pantone-blue"
                            />
                        </div>


                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto rounded-lg bg-pantone-red px-4 py-2.5 text-white hover:bg-pantone-red/90 transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateRoomReservation}
                                className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition font-medium"
                            >
                                Actualizar Reservación
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

}

export default ReservationFormEdit;
