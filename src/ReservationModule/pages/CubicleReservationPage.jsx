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
            } catch (error) {
                console.error('Error al crear Reservación:', error);
            }
        }

        await Swal.fire({
            title: '¡Reservado!',
            text: 'Se ha realizado la reserva de tu cubículo con éxito',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                navigate('/');
            }
        });

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
            console.log("ID externo recibido y almacenado en la referencia:", idExternalRef.current);

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
        <BackButton/>
        <div className="max-w-screen-2xl mx-auto px-5" style={{ paddingTop: "50px" }}>


            <div className="flex flex-col md:flex-row h-screen p-5">
                <Routes>
                    <Route path="createExternalUser"
                           element={<UserExternalFormCreate onUserCreated={handleUserCreated}/>}/>
                    <Route path="reserveUser" element={<ReservationForUser onUserSearched={handleUserSearched}/>}/>
                </Routes>


                <div
                    className="w-full md:w-1/5 md:mr-5 bg-gray-100 p-3 rounded-lg shadow-lg flex flex-col overflow-hidden md:h-[90vh]">
                    <h3 className="text-center text-lg mb-5 md:text-left whitespace-nowrap sticky top-0 bg-gray-100 z-10">
                        Cubículos Disponibles
                    </h3>
                    <ul className="flex flex-row md:flex-col list-none p-0 m-0 space-x-3 md:space-x-0 md:space-y-2 overflow-y-auto">
                        {cubicles.map((cubicle) => {
                            return (
                                <li
                                    key={cubicle.idCubiculo}
                                    onClick={() => handleCubicleSelect(cubicle)}
                                    className={`relative p-3 cursor-pointer rounded h-28 md:h-24 ${selectedCubicleR?.idCubiculo === cubicle.idCubiculo ? 'bg-gray-300 shadow-inner' : 'bg-white'}`}
                                >
                    <span className="block text-center font-medium mb-2 md:mb-0.5">
                        {cubicle.Nombre}
                    </span>
                                    <span
                                        className="absolute bottom-0 left-0 right-0 text-xs md:text-sm text-gray-600 px-2 py-1 text-center w-full">
                        {cubicle.Ventana ? 'Con ventana' : 'Sin ventana'}
                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>


                {/* Contenedor del calendario */}
                <div className="w-full md:w-4/5 flex flex-col bg-white p-5 rounded-lg shadow-lg flex-grow min-h-min">
                    <div
                        className="flex flex-col md:flex-row justify-between items-center mb-5 space-y-2 md:space-y-0 md:space-x-2">
                        <h2 className="text-xl m-0 flex-grow">
                            {selectedCubicleR ? `Reservar Cubículo: ${selectedCubicleR.Nombre}` : 'Seleccionar Cubículo'}
                        </h2>
                        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                            {(!(role === 'Estudiante' || role === 'Externo' || role === 'Profesor' || role === 'AdministradorSolicitudes')) && (
                                <button
                                    onClick={handleCreateUserReservation}
                                    className="px-4 py-2 bg-pantone-blue text-white border-none rounded cursor-pointer w-full md:w-auto hover:bg-pantone-blue/80"
                                >
                                    Reservar por Usuario
                                </button>
                            )}
                            {(!(role === 'Estudiante' || role === 'Externo' || role === 'Profesor' || role === 'AdministradorSolicitudes')) && (
                                <button
                                    onClick={handleCreateExternalReservation}
                                    className="px-4 py-2 bg-pantone-blue text-white border-none rounded cursor-pointer w-full md:w-auto hover:bg-pantone-blue/80"
                                >
                                    Reservar Externo
                                </button>
                            )}
                            <button
                                onClick={handleCubicleReservationCreated}
                                className="px-4 py-2 bg-pantone-red text-white border-none rounded cursor-pointer w-full md:w-auto hover:bg-pantone-red/80"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-pantone-blue text-white border-none rounded cursor-pointer w-full md:w-auto hover:bg-pantone-blue/80"
                            >
                                Reservar
                            </button>
                        </div>
                    </div>

                    {/* Contenido del calendario */}
                    <div className="flex-grow mt-5 md:mt-0">
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

                {/* Modal de creación de usuario externo */}
                {isModalOpen && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <UserExternalFormCreate onUserCreated={handleUserCreated} onCancel={handleCloseModal}/>
                    </div>
                )}

                {/* Modal de búsqueda de usuario */}
                {isModalUserSearchedOpen && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <ReservationForUser onUserSearched={handleUserSearched} onCancel={handleCloseModalUser}/>
                    </div>
                )}
            </div>
        </div>
        </>
    );


}

export default CubiclesReservationPage;