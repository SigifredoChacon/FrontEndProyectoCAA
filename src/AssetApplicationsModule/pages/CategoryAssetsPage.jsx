import {Link, useNavigate} from "react-router-dom";
import React from "react";

export function CategoryAssetsPage() {
    const navigate = useNavigate(); // Hook para redireccionar a otras rutas

    // Array que define las categorías de activos disponibles con sus nombres, rutas, e identificadores + íconos SVG
    const navigation = [
        {
            name: 'Laptop',
            href: '/assetsRequest',
            id: 1,
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                     className="w-16 h-16 mb-4">
                    <path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/>
                    <path d="M20.054 15.987H3.946"/>
                </svg>
            )
        },
        {
            name: 'Proyector',
            href: '/assetsRequest',
            id: 2,
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                     className="w-16 h-16 mb-4">
                    <path d="M5 7 3 5"/>
                    <path d="M9 6V3"/>
                    <path d="m13 7 2-2"/>
                    <circle cx="9" cy="13" r="3"/>
                    <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17"/>
                    <path d="M16 16h2"/>
                </svg>
            )
        },
        {
            name: 'Monitor',
            href: '/assetsRequest',
            id: 3,
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                     className="w-16 h-16 mb-4">
                    <rect width="20" height="14" x="2" y="3" rx="2"/>
                    <line x1="8" x2="16" y1="21" y2="21"/>
                    <line x1="12" x2="12" y1="17" y2="21"/>
                </svg>
            )
        },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            {/* Botón para navegar a la página de inicio */}
            <button
                onClick={() => navigate('/')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
                style={{
                    background: 'none',
                    border: 'none',
                }}
            >
                {/* Ícono de flecha hacia la izquierda */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            {/* Contenedor de cuadrícula para mostrar las categorías de activos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full max-w-4xl">
                {navigation.map((item) => (
                    // Enlace para cada categoría de activo
                    <Link
                        key={item.name} // Clave única para cada elemento
                        to={{
                            pathname: item.href, // Ruta de destino
                        }}
                        state={{id: item.id}} // Pasa el ID de la categoría como estado
                        className="text-none"
                    >
                        {/* Estilo del enlace con animación y sombreado */}
                        <div
                            className="w-72 h-56 p-6 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            {item.svg} {/* Ícono de la categoría */}
                            <div className="text-xl text-center text-gray-800">
                                {item.name} {/* Nombre de la categoría */}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
