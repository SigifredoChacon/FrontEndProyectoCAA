import {Link, useNavigate} from "react-router-dom";
import Check from "/src/assets/check.svg";
import Computer from "/src/assets/computadora.svg";
import General from "/src/assets/GReservations.svg";
import Digital from "/src/assets/digital.svg";
import BackButton from "../../utils/BackButton.jsx";
import React from "react";

export function ManageApplicationPage() {
    // Array que define las secciones de gestión disponibles con su nombre, ruta y ícono SVG correspondiente
    const navigation = [
        { name: 'Activos', href: '/assets', current: false, svg: Computer },
        { name: 'Historial de Solicitudes', href: '/allRequests', current: false, svg: General },
        { name: 'Solicitudes Pendientes', href: '/pendingApplications', current: false, svg: Check },
        { name: 'Solicitudes Por Firmar', href: '/toSignApplication', current: false, svg: Digital },
    ];

    const navigate = useNavigate(); // Hook para redireccionar a otras rutas

    return (
        <>
        <BackButton/>
        <div className="flex items-center justify-center min-h-screen p-6">

            {/* Cuadrícula de enlaces a diferentes secciones de la gestión de solicitudes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {navigation.map((item) => (
                    // Enlace para cada sección de gestión
                    <Link
                        key={item.name} // Clave única para cada elemento
                        to={item.href} // Ruta de destino
                        className="text-none"
                    >
                        {/* Contenedor de cada sección con estilo y animación */}
                        <div
                            className="w-72 h-56 p-6 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            <img src={item.svg} alt={`${item.name} icon`} className="mb-4 w-16 h-16"/> {/* Ícono grande */}
                            <div className="text-xl text-center text-gray-800">
                                {item.name} {/* Nombre de la sección */}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        </>
    );
}
