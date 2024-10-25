import {Link, useNavigate} from "react-router-dom";
import React from "react";

export function CategoryAssetsPage() {
    const navigate = useNavigate(); // Hook para redireccionar a otras rutas

    // Array que define las categorías de activos disponibles con sus nombres, rutas, e identificadores
    const navigation = [
        { name: 'Laptop', href: '/assetsRequest', id: 1 },
        { name: 'Proyector', href: '/assetsRequest', id: 2 },
        { name: 'Monitor', href: '/assetsRequest', id: 3 },
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
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            <div className="text-lg text-center text-gray-800">
                                {item.name} {/* Nombre de la categoría */}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
