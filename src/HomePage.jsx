import {useNavigate} from "react-router-dom";
import {useAuthContext} from "./SecurityModule/hooks/useAuthContext.js";
import useReservationChecker from "./ReservationModule/hooks/useReservationChecker.js";
import React, {useEffect, useState} from "react";
import {createValoration} from "./ReservationModule/services/valorationService.jsx";
import {updateReservation} from "./ReservationModule/services/reservationService.jsx";
import {getUserById} from "./SecurityModule/services/userService.jsx";
import Swal from "sweetalert2";
import SalaDeReunion from "./assets/SalaDeReunion.jpeg";
import cubiculos from "./assets/cubiculos.jpg";
import computadoras from "./assets/computadoras.png";
import StarRating from "./ReservationModule/components/Reservations/StarRating.jsx";

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
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
            {/* Botón para navegar a la vista de reservas de salas */}
            <button
                onClick={() => navigate('/allRoomReservation')}
                className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                style={{
                    fontSize: 'clamp(2rem, 5vw, 8rem)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    borderRadius: '50px',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${SalaDeReunion})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(50%)',
                        borderRadius: 'inherit',
                    }}
                ></div>
                <span style={{ position: 'relative', zIndex: 1 }}>Salas</span>
            </button>

            {/* Botón condicional para navegar a reservas de cubículos (solo para usuarios no estudiantes) */}
            {role !== 'Estudiante' && role && (
                <button
                    onClick={() => navigate('/reservationsCubicle')}
                    className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 8rem)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        borderRadius: '50px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${cubiculos})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(50%)',
                            borderRadius: 'inherit',
                        }}
                    ></div>
                    <span style={{ position: 'relative', zIndex: 1 }}>Cubículos</span>
                </button>
            )}

            {/* Botón condicional para navegar a la categoría de activos (solo para usuarios no estudiantes) */}
            {role !== 'Estudiante' && role && (
                <button
                    onClick={handleClickAssets}
                    className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 8rem)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        borderRadius: '50px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${computadoras})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(50%)',
                            borderRadius: 'inherit',
                        }}
                    ></div>
                    <span style={{ position: 'relative', zIndex: 1 }}>Activos</span>
                </button>
            )}

            {/* Modal condicional para mostrar el formulario de valoración */}
            {isValorationOpen && (
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
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <h2 style={{textAlign: 'center', fontWeight: 'bold'}}>Valorar Reservación</h2>
                        <p style={{textAlign: 'center'}}>¿Cómo fue tu experiencia en {activeReservation.idSala ? 'la sala' : 'el cubículo'}?</p>

                        {/* Componente de estrellas para la calificación */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            marginTop: '20px'
                        }}>
                            <StarRating rating={rating} onRating={setRating}/>
                        </div>
                        <h2 style={{marginBottom: '10px'}}>Observaciones:</h2>
                        {/* Campo de observaciones */}
                        <textarea
                            name="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Tu opinion nos ayuda a mejorar"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginBottom: '20px'
                            }}
                            rows={4}
                        />

                        {/* Botones Confirmar y Cancelar */}
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button
                                onClick={handleSubmitValoration}
                                style={{
                                    backgroundColor: '#0d6efd',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCloseValoration}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
