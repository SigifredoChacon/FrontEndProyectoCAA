import React, {useState, useEffect, useRef} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import { useCubicleReservationEdit } from "../hooks/useCubicleReservationEdit.js";
import { useCubicleEdit } from "../hooks/useCubicleEdit.js";
import Calendar from '../components/Calendar/Calendar.jsx';
import { getCubicles } from '../services/cubicleService.jsx';
import { createReservation } from "../services/reservationService.jsx";
import {useAuthContext} from "../../SecurityModule/hooks/useAuthContext.js";
import UserExternalFormCreate from "../../SecurityModule/components/User/UserExternalFormCreate.jsx";
import Swal from "sweetalert2";
import ReservationForUser from "../components/Reservations/ReservationForUser.jsx";
import BackButton from "../../utils/BackButton.jsx";

const initialCubicleReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idCubiculo: 0,
    idUsuario: 0,
    observaciones: '',
    refrigerio: false,
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
    const [calendarClearSignal, setCalendarClearSignal] = useState(0);

    const navigate = useNavigate();



    useEffect(() => {
        fetchCubicles();


    }, []);

    const fetchCubicles = async () => {
        try {
            const data = await getCubicles();
            const filteredData = data.filter(cubicle => cubicle.Estado === true);
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

                    await makeCubicleReservation(groupedTimes, selectedDay, 0);
                } else {

                    console.log("Reserva cancelada por el usuario");
                }
            });
        } else {

            await makeCubicleReservation(groupedTimes, selectedDay, 1);
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

                await Swal.fire({
                    title: '¡Reservado!',
                    text: 'Se ha realizado la reserva de tu cubículo con éxito',
                    icon: 'success',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        navigate('/personalReservations');
                    }
                });
            } catch (error) {
                setReservation(initialCubicleReservationState)
                setReservations([])
                setCalendarClearSignal((s) => s + 1)
                await Swal.fire({
                    title: '¡Error!',
                    text: error.response.data.message,
                    icon: 'error',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
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
                confirmButtonText: 'Aceptar',
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
    };

    const handleAddCubicleReservation = () => {
        setIsCreating(true);
        handleEditCubicle(null);
        handleEditCubicleReservation(null);
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

            setReservation(prevReservation => ({
                ...prevReservation,
                idUsuario: idExternalRef.current,
            }));

            setIsModalOpen(false);
            navigate('/reservationsCubicle');
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
            navigate('/reservationsCubicle');
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


                <div className="xl:hidden mb-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <h2 className="text-lg font-bold text-pantone-blue mb-4 text-center">
                            Cubículos Disponibles
                        </h2>


                        <div className="overflow-x-auto -mx-4 px-4">
                            <div className="flex gap-3 pb-2" style={{ minWidth: 'min-content' }}>
                                {cubicles.map((cubicle) => (
                                    <button
                                        key={cubicle.idCubiculo}
                                        onClick={() => handleCubicleSelect(cubicle)}
                                        className={`
                                    flex-shrink-0 w-28 p-3 rounded-xl border-2 transition-all duration-200
                                    ${selectedCubicleR?.idCubiculo === cubicle.idCubiculo
                                            ? 'border-pantone-blue bg-pantone-blue/10 shadow-md'
                                            : 'border-slate-200 bg-white hover:border-pantone-blue/50'
                                        }
                                `}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                    <span className="font-semibold text-pantone-blue text-sm text-center">
                                        {cubicle.Nombre}
                                    </span>
                                            <span className="text-xs text-slate-600 text-center">
                                        {cubicle.Ventana ? 'Con ventana' : 'Sin ventana'}
                                    </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">


                    <aside className="hidden xl:block xl:col-span-4">
                        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                            <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-5 py-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Cubículos Disponibles
                                </h2>
                            </div>


                            <div className="p-4 max-h-[600px] overflow-y-auto">
                                <div className="space-y-3">
                                    {cubicles.map((cubicle) => (
                                        <button
                                            key={cubicle.idCubiculo}
                                            onClick={() => handleCubicleSelect(cubicle)}
                                            className={`
                                        w-full p-4 rounded-xl border-2 transition-all duration-200
                                        ${selectedCubicleR?.idCubiculo === cubicle.idCubiculo
                                                ? 'border-pantone-blue bg-pantone-blue/10 shadow-md'
                                                : 'border-slate-200 bg-white hover:border-pantone-blue/50 hover:shadow-sm'
                                            }
                                    `}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                        <span className="font-semibold text-pantone-blue text-lg">
                                            {cubicle.Nombre}
                                        </span>
                                                <span className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                            ${cubicle.Ventana
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                }
                                        `}>
                                            {cubicle.Ventana ? (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                                                    </svg>
                                                    Con ventana
                                                </>
                                            ) : (
                                                'Sin ventana'
                                            )}
                                        </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>


                    <section className="xl:col-span-8">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">


                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-pantone-blue">
                                    {selectedCubicleR
                                        ? `Reservar: ${selectedCubicleR.Nombre}`
                                        : 'Seleccionar Cubículo'
                                    }
                                </h1>
                            </div>


                            {selectedCubicleR ? (
                                <div className="mb-6">
                                    <Calendar
                                        key={calendarKey}
                                        onReservationsChange={handleReservationsChange}
                                        selectedCubicleId={selectedCubicleR.idCubiculo}
                                        clearSignal={calendarClearSignal}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-slate-500 text-lg">
                                            Por favor, selecciona un cubículo para continuar
                                        </p>
                                    </div>
                                </div>
                            )}


                            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
                                {!(role === 'Estudiante' || role === 'Externo' || role === 'Profesor' || role === 'AdministradorSolicitudes') && (
                                    <>
                                        <button
                                            onClick={handleCreateUserReservation}
                                            className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition font-medium"
                                        >
                                            Reservar por Usuario
                                        </button>
                                        <button
                                            onClick={handleCreateExternalReservation}
                                            className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition font-medium"
                                        >
                                            Reservar Externo
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={handleCubicleReservationCreated}
                                    className="w-full sm:w-auto rounded-lg bg-pantone-red px-4 py-2.5 text-white hover:bg-pantone-red/90 transition font-medium"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedCubicleR}
                                    className="w-full sm:w-auto rounded-lg bg-pantone-blue px-4 py-2.5 text-white hover:bg-pantone-blue/90 transition font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Reservar
                                </button>
                            </div>
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

export default CubiclesReservationPage;