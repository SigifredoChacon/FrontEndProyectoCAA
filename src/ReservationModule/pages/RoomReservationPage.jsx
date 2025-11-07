import React, {useEffect, useRef, useState} from "react";
import CalendarRooms from "../components/Calendar/CalendarRooms.jsx";
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {useAuthContext} from "../../SecurityModule/hooks/useAuthContext.js";
import {useRoomReservationEdit} from "../hooks/useRoomReservationEdit.js";
import {createReservation} from "../services/reservationService.jsx";
import {getResources} from "../services/resourceService.jsx";
import UserExternalFormCreate from "../../SecurityModule/components/User/UserExternalFormCreate.jsx";
import Swal from "sweetalert2";
import ReservationForUser from "../components/Reservations/ReservationForUser.jsx";
import BackButton from "../../utils/BackButton.jsx";

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
    encuestaCompletada: false,

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
    };

    const handleCreateRoomReservation = async () => {
        if (!user) {
            Swal.fire({
                title: '¡Tienes que estar registrado!',
                text: 'Para poder realizar una reservación, por favor, inicia sesión 🤗',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'bg-pantone-blue text-white px-4 py-2 rounded hover:bg-pantone-blue/80 mr-2'
                },
                buttonsStyling: false
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
                customClass: {
                    confirmButton: 'bg-pantone-blue text-white px-4 py-2 rounded hover:bg-pantone-blue/80 mr-2',
                    cancelButton: 'bg-pantone-red text-white px-4 py-2 rounded hover:bg-pantone-red/80 ml-2'
                },
                buttonsStyling: false
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
                    estado: estado,
                };

                console.log(RoomReservationToCreate);

                await createReservation(RoomReservationToCreate);
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }
        await Swal.fire({
            title: '¡Reservado!',
            text: 'Se ha realizado la reserva de tu sala con exito',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                navigate('/personalReservations');
            }
        });
        handleRoomReservationCreated();
        setReservation(initialRoomReservationState);
    };


    const handleCreateExternalReservation = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUserCreated = (idExternal) => {
        if (idExternal !== undefined) {
            idExternalRef.current = parseInt(idExternal, 10);
            console.log("ID externo recibido y almacenado en la referencia:", idExternalRef.current);

            setReservation(prevReservation => ({
                ...prevReservation,
                idUsuario: idExternalRef.current,
            }));

            setIsModalOpen(false);
            navigate('/reservationsRoom', { state: { selectedRoom } });
        } else {
            console.warn("Se intentó asignar un ID externo undefined.");
        }
    };

    const handleCreateUserReservation = () => {
        setIsModalUserSearchedOpen(true);
    };

    const handleCloseModalUser = () => {
        setIsModalUserSearchedOpen(false);
    };


    const handleUserSearched = (idUserSearched) => {
        if (idUserSearched !== undefined) {
            idExternalRef.current = parseInt(idUserSearched, 10);
            console.log("ID externo recibido y almacenado en la referencia:", idExternalRef.current);

            setReservation(prevReservation => ({
                ...prevReservation,
                idUsuario: idExternalRef.current,
            }));

            setIsModalUserSearchedOpen(false);
            navigate('/reservationsRoom', { state: { selectedRoom } });
        } else {
            console.warn("Se intentó asignar un ID externo undefined.");
        }
    };

    return (
        <>
            <BackButton />


            <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 mt-12 mb-28">

                <Routes>
                    <Route path="createExternalUser" element={<UserExternalFormCreate onUserCreated={handleUserCreated} />} />
                    <Route path="reserveUser" element={<ReservationForUser onUserSearched={handleUserSearched} />} />
                </Routes>


                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    <aside className="xl:col-span-5">
                        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                            <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-5 py-4">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    {selectedRoom.Nombre}
                                </h1>
                            </div>


                            <div className="overflow-hidden">
                                <img
                                    src={selectedRoom.imageUrl}
                                    alt={selectedRoom.Nombre}
                                    className="w-full aspect-video lg:aspect-[4/3] object-cover"
                                />
                            </div>


                            <div className="p-4 sm:p-5">
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-pantone-blue font-semibold">Descripción de la sala</h3>
                                        <p className="mt-2 text-slate-700 leading-relaxed">
                                            {selectedRoom.Descripcion}
                                        </p>
                                    </div>

                                    {selectedRoom.Restricciones && (
                                        <div>
                                            <h3 className="text-pantone-blue font-semibold">Restricciones</h3>
                                            <p className="mt-2 text-slate-700 leading-relaxed">
                                                {selectedRoom.Restricciones}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 h-1 w-20 rounded-full bg-pantone-red" />
                            </div>
                        </div>
                    </aside>


                    <section className="xl:col-span-7">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">


                                <div className="w-full">
                                    <CalendarRooms
                                        selectedRoomId={selectedRoom.idSala}
                                        onReservationsChange={handleReservationsChange}
                                    />
                                </div>

                        </div>


                        {user && (
                            <>
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!(role === 'Estudiante' || role === 'Externo') && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <label className="block text-sm font-semibold text-pantone-blue mb-2">Refrigerio</label>
                                            <div className="flex items-center gap-5">
                                                <label className="inline-flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="refrigerio"
                                                        value="si"
                                                        onChange={handleSnackChange}
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
                                                        className="h-4 w-4 text-pantone-blue focus:ring-pantone-blue border-slate-300"
                                                    />
                                                    <span>No</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <label className="block text-sm font-semibold text-pantone-blue mb-2">
                                            Recursos Disponibles
                                        </label>
                                        <select
                                            name="idRecursos"
                                            id="idRecursos"
                                            onChange={handleChangeResource}
                                            required
                                            className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 shadow-sm focus:border-pantone-blue focus:ring-pantone-blue text-sm"
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
                                        className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-pantone-blue focus:ring-pantone-blue"
                                    />
                                </div>
                            </>
                        )}

                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                            {(role === 'Administrador' || role === 'AdministradorReservaciones') && (
                                <>
                                    <button
                                        onClick={handleCreateUserReservation}
                                        className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition"
                                    >
                                        Reservar por Usuario
                                    </button>
                                    <button
                                        onClick={handleCreateExternalReservation}
                                        className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition"
                                    >
                                        Reservar Externo
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleRoomReservationCreated}
                                className="w-full sm:w-auto rounded-lg bg-pantone-red px-4 py-2.5 text-white hover:bg-pantone-red/90 transition"
                            >
                                Cancelar
                            </button>

                            {user && (
                                <button
                                    onClick={handleCreateRoomReservation}
                                    className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition"
                                >
                                    Reservar
                                </button>
                            )}
                        </div>
                    </section>
                </div>
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl">
                        <UserExternalFormCreate onUserCreated={handleUserCreated} onCancel={handleCloseModal} />
                    </div>
                </div>
            )}

            {isModalUserSearchedOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl">
                        <ReservationForUser onUserSearched={handleUserSearched} onCancel={handleCloseModalUser} />
                    </div>
                </div>
            )}
        </>


    );
}