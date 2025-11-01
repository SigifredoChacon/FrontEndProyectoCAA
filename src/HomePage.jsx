import {useNavigate} from "react-router-dom";
import {useAuthContext} from "./SecurityModule/hooks/useAuthContext.js";
import useReservationChecker from "./ReservationModule/hooks/useReservationChecker.js";
import React, {useEffect, useState} from "react";
import {createValoration} from "./ReservationModule/services/valorationService.jsx";
import {updateReservation} from "./ReservationModule/services/reservationService.jsx";
import {getUserById} from "./SecurityModule/services/userService.jsx";
import Swal from "sweetalert2";
import SalaDeReunion from "./assets/SalaDeReunion.jpeg";
import TecAlajuela from "./assets/tecAlajuela.webp";
import cubiculos from "./assets/cubiculos.jpg";
import computadoras from "./assets/computadoras.png";
import StarRating from "./ReservationModule/components/Reservations/StarRating.jsx";
// Arriba de tu componente



function HomePage() {
    // Hook para navegar entre rutas en la aplicación
    const navigate = useNavigate();

    // Obtiene el rol y usuario actual desde el contexto de autenticación
    const { role } = useAuthContext();
    const { user } = useAuthContext();

    // Hook personalizado para verificar reservaciones expiradas
    const expiredReservations = useReservationChecker();

    // Estado para almacenar la reservación activa que requiere valoración
    const [activeReservation, setActiveReservation] = useState(null);

    // Estado para almacenar la calificación proporcionada por el usuario
    const [rating, setRating] = useState(0);

    // Estado para almacenar las observaciones del usuario
    const [observaciones, setObservaciones] = useState('');

    // Estado que controla la apertura y cierre del formulario de valoración
    const [isValorationOpen, setIsValorationOpen] = useState(false);

    // useEffect se ejecuta al detectar cambios en 'expiredReservations'
    useEffect(() => {
        // Si existen reservaciones expiradas, selecciona la primera y abre el formulario de valoración
        if (expiredReservations.length > 0) {
            setActiveReservation(expiredReservations[0]);
            setIsValorationOpen(true);
        }
    }, [expiredReservations]);

    // Maneja el envío de la valoración del usuario
    // Entrada: e (evento del formulario)
    // Salida: actualiza la reservación en la base de datos e informa al usuario
    const handleSubmitValoration = async (e) => {
        e.preventDefault();
        try {
            // Crea una valoración con los datos de la reservación activa
            await createValoration({
                idSala: activeReservation.idSala,
                idCubiculo: activeReservation.idCubiculo,
                nota: rating,
                observaciones
            });
            // Marca la encuesta como completada para la reservación
            await updateReservation(activeReservation.idReservacion, { encuestaCompletada: true });

            // Resetea los valores de los estados al enviar la valoración
            setActiveReservation(null);
            setRating(0);
            setObservaciones('');
            setIsValorationOpen(false);
        } catch (error) {
            console.error('Error al enviar la valoración:', error);
        }
    };

    // Cierra el formulario de valoración sin enviar datos
    // Entrada: ninguna
    // Salida: cierra el modal de valoración y marca la encuesta como completada
    const handleCloseValoration = async () => {
        await updateReservation(activeReservation.idReservacion, { encuestaCompletada: true });
        setIsValorationOpen(false);
    };

    // Maneja la redirección para reserva de activos según información completa del usuario
    // Entrada: ninguna
    // Salida: redirige a la ruta de activos o perfil según los datos del usuario
    const handleClickAssets = async () => {
        // Obtiene información completa del usuario
        const userInfo = await getUserById(user);

        // Verifica si el usuario tiene los datos requeridos completos para continuar
        if (userInfo.CorreoInstitucional && userInfo.Telefono && userInfo.Telefono2 && userInfo.Direccion) {
            navigate('/categoryAssets');
        } else {
            // Muestra mensaje de error si falta información y permite ir al perfil
            await Swal.fire({
                title: '¡Error!',
                text: 'Debes completar tu información personal para poder reservar activos',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Ir a perfil',
                cancelButtonText: 'Cerrar',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/profile');
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative w-full bg-blue-900 text-white py-20 px-6 text-center">
                <div className="absolute inset-0">
                    <img
                        src={TecAlajuela}
                        alt="Coworking"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Sistema de Reservaciones CAA</h1>
                    <p className="text-lg md:text-xl">
                        Reserva salas, cubículos y recursos de forma rápida y sencilla.
                    </p>
                </div>
            </section>

            {/* Introducción */}
            <section className="max-w-5xl mx-auto py-12 px-6 text-center">
                <p className="text-gray-700 text-lg md:text-xl">
                    Este sistema está diseñado para estudiantes y profesores del Centro Académico de Alajuela. Aquí puedes
                    reservar salas para reuniones, cubículos para trabajo individual y solicitar
                    recursos de la institución. No te compliques y asegura tu espacio al instante.
                </p>
            </section>

            {/* Botones de reservación */}
            <section className={`grid gap-8 max-w-6xl mx-auto px-6 pb-16 ${role !== 'Estudiante' && role ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 place-items-center'}`}>
                {/* Salas */}
                <div
                    onClick={() => navigate('/allRoomReservation')}
                    className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
                >
                    <img
                        src={SalaDeReunion}
                        alt="Salas"
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center">
                        <h3 className="text-3xl font-bold mb-2">Salas</h3>
                        <p className="text-lg">Espacios para reuniones y presentaciones</p>
                    </div>

                </div>

                {/* Cubículos (solo si role !== Estudiante) */}
                {role !== 'Estudiante' && role && (
                    <div
                        onClick={() => navigate('/reservationsCubicle')}
                        className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
                    >
                        <img
                            src={cubiculos}
                            alt="Cubículos"
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center">
                            <h3 className="text-3xl font-bold mb-2">Cubículos</h3>
                            <p className="text-lg">Áreas individuales para concentración</p>
                        </div>

                    </div>
                )}

                {/* Activos (solo si role !== Estudiante) */}
                {role !== 'Estudiante' && role && (
                    <div
                        onClick={handleClickAssets}
                        className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
                    >
                        <img
                            src={computadoras}
                            alt="Activos"
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center">
                                <h3 className="text-3xl font-bold mb-2">Activos</h3>
                                <p className="text-lg">Equipos y material académicos</p>
                            </div>
                    </div>
                )}
            </section>

            {/* Cómo funciona */}
            <section className="bg-white py-16 w-full">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">¿Cómo funciona?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 shadow rounded-xl bg-gray-50">
                            <h3 className="text-xl font-semibold mb-2">1. Inicia sesión</h3>
                            <p className="text-gray-600">Accede con tu cuenta o crea una.</p>
                        </div>
                        <div className="p-6 shadow rounded-xl bg-gray-50">
                            <h3 className="text-xl font-semibold mb-2">2. Selecciona</h3>
                            <p className="text-gray-600">Elige el espacio o recurso que necesites.</p>
                        </div>
                        <div className="p-6 shadow rounded-xl bg-gray-50">
                            <h3 className="text-xl font-semibold mb-2">3. Reserva</h3>
                            <p className="text-gray-600">Haz tu reservación y recibe confirmación.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de valoración (se conserva como lo tenías) */}
            {isValorationOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-bold text-center mb-2">Valorar Reservación</h2>
                        <p className="text-center mb-4">
                            ¿Cómo fue tu experiencia en {activeReservation.idSala ? 'la sala' : 'el cubículo'}?
                        </p>
                        <div className="flex justify-center mb-4">
                            <StarRating rating={rating} onRating={setRating} />
                        </div>
                        <textarea
                            name="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Tu opinión nos ayuda a mejorar"
                            className="w-full border rounded-lg p-2 mb-4"
                            rows={4}
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmitValoration}
                                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCloseValoration}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                No responder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default HomePage;
