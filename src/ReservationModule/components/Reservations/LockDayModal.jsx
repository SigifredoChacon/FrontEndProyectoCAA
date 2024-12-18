import {
    deleteReservationByDate,
    createReservation,
    getReservationByDate,
    deleteReservation
} from '../../services/reservationService.jsx';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../../SecurityModule/hooks/useAuthContext.js";
import {getCubicles} from "../../services/cubicleService.jsx";
import {getRooms} from "../../services/roomService.jsx";
import {addDays, format} from "date-fns";
import {sendAllEmail} from "../../../SecurityModule/services/userService.jsx";
import {es} from "date-fns/locale";
import Swal from "sweetalert2";

const initialReservationState = {
    fecha: '',
    horaInicio: '07:30',
    horaFin: '16:30',
    idSala: null,
    idCubiculo: null,
    idUsuario: 0,
    observaciones: 'Bloqueo de día por mantenimiento o actividad especial',
    refrigerio: false,
    estado: true,
    encuestaCompletada: true,
};

function LockDayModal({ onCancel }) {
    const navigate = useNavigate();
    const [asunto] = useState('Bloqueo de Fecha');
    const [descripcion, setDescripcion] = useState('');
    const [date, setDate] = useState(new Date());
    const { user } = useAuthContext();
    const {role} = useAuthContext();
    const [rooms, setRooms] = useState([]);
    const [cubicles, setCubicles] = useState([]);
    const [reservation, setReservation] = useState(initialReservationState);
    initialReservationState.idUsuario = user;

    useEffect(() => {
        fetchCubicles();
        fetchRooms();
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

    const fetchRooms = async () => {
        try {
            const data = await getRooms();
            const filteredData = data.filter(room => room.Estado === 1);
            setRooms(filteredData);
        } catch (error) {
            console.error('Error al obtener las salas:', error);
        }
    };

    const handleLockDay = async () => {

        await Swal.fire({
            title: '¡Vas a Bloquear una fecha!',
            text: '¿Estás seguro de que deseas bloquear esta fecha en especifico?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const descriptionDate = format(date, 'dd MMMM yyyy', { locale: es });
                    const newDescripcion = `Le informamos que la fecha ${descriptionDate} ha sido bloqueada debido a motivos administrativos. Lamentamos los inconvenientes que esto pueda causar. En caso de que hubiese alguna reservación programada para dicha fecha, esta ha sido cancelada de manera automática. Agradecemos su comprensión.`;
                    setDescripcion(newDescripcion);

                    try {

                        const formattedDate = format(date, 'yyyy-MM-dd');

                        const nextDay = format(addDays(date, 1), 'yyyy-MM-dd');


                        const reservations = await getReservationByDate(formattedDate);


                        if (reservations.length > 0) {
                            await deleteReservationByDate(formattedDate);
                        }



                        await makeCubicleReservation(nextDay);
                        await makeRoomReservation(nextDay);

                        await Swal.fire({
                            title: '¡Bloqueado!',
                            text: 'Se han bloqueado las salas y cubículos para la fecha seleccionada',
                            icon: 'success',
                            timer: 1000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });

                        try {
                            await sendAllEmail({ asunto, descripcion: newDescripcion });
                            alert('Se les ha informado a todos los usuarios via Email');
                        } catch (error) {
                            alert('Error al enviar email');
                        }

                        onCancel();
                    } catch (error) {
                        await Swal.fire({
                            title: '¡Error!',
                            text: 'No se ha podido bloquear este día',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });
                    }


                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'No se ha podido bloquear este día',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                }
            }
        });
    };


    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value + 'T00:00:00');
        setDate(newDate);
        console.log("Fecha seleccionada: ", newDate);
    };

    const makeCubicleReservation = async (formattedDate) => {
        try {
            if(cubicles.length > 0) {
                for (const cubicle of cubicles) {
                    const ReservationToCreate = {
                        ...reservation,
                        idCubiculo: cubicle.idCubiculo,
                        fecha: formattedDate,
                    };

                    console.log("Creando reservación para el cubículo:", cubicle.idCubiculo);

                    await createReservation(ReservationToCreate);
                    setReservation(initialReservationState);
                }
            }
        }
        catch (error) {
            console.error('Error al procesar la reservación:', error);
        }
        setReservation(initialReservationState);
    };

    const makeRoomReservation = async (formattedDate) => {
        try {
            if (rooms.length > 0) {
                for (const room of rooms) {
                    const ReservationToCreate = {
                        ...reservation,
                        idSala: room.idSala,
                        fecha: formattedDate,
                    };

                    console.log("Creando reservación para la sala:", room.idSala);

                    await createReservation(ReservationToCreate);
                    setReservation(initialReservationState);
                }
            }
        }
        catch (error) {
            console.error('Error al crear Reservación:', error);
        }
        setReservation(initialReservationState);
    }

    return (
        <div className="calendar max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-lg">
            <h2 className="text-center text-3xl font-bold mb-5">
                Bloquear Día
            </h2>

            <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800">
                    Selecciona una fecha:
                </label>
                <input
                    type="date"
                    value={format(date, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full p-2 text-base border border-gray-300 rounded focus:border-blue-800 focus:outline-none transition duration-300"
                />
            </div>

            <div className="flex justify-between space-x-4">
                <button
                    onClick={handleLockDay}
                    className="w-1/2 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition duration-300"
                >
                    Confirmar
                </button>

                <button
                    onClick={onCancel}
                    className="w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-500 transition duration-300"
                >
                    Cancelar
                </button>
            </div>
        </div>

    )
}

export default LockDayModal;
