import React, { useEffect, useState } from 'react';
import api from '../../../utils/api.js';

// Componente modal para mostrar el archivo PDF de una solicitud del usuario.
// Props:
// - open: booleano que controla si el modal está visible.
// - handleClose: función para cerrar el modal.
// - archivoSolicitud: string con la ruta del archivo PDF de la solicitud.
function ShowApplicationByUserModal({ open, handleClose, archivoSolicitud }) {
    // Estado que almacena la URL del PDF para la vista previa en el modal
    const [pdfUrl, setPdfUrl] = useState(null);

    // useEffect que configura el PDF cada vez que el modal se abre o cambia el archivo de la solicitud
    // Dependencias: open y archivoSolicitud
    useEffect(() => {
        // Si el modal está abierto y hay un archivo de solicitud, se configura la URL del PDF
        if (open && archivoSolicitud) {
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
    }, [open, archivoSolicitud]);

    // Si el modal no está abierto, retorna null para no renderizar nada
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-11/12 md:w-3/4 lg:w-2/3 shadow-lg">

                {/* Mensaje para usuarios de pantallas pequeñas con opción para descargar el PDF */}
                <div className="block sm:hidden text-center text-gray-500 mb-4">
                    <p>Por favor, utilice una pantalla más grande para ver el documento o descárguelo a
                        continuación.</p>
                    <a
                        href={pdfUrl}
                        download
                        className="text-blue-500 underline hover:text-blue-600 mt-2 inline-block"
                    >
                        Descargar PDF
                    </a>
                </div>

                {/* Vista previa del PDF para pantallas medianas y grandes */}
                <div className="relative w-full h-[80vh] hidden sm:block">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="Documento PDF"
                            className="w-full h-full rounded-lg"
                        />
                    ) : (
                        <p className="text-gray-500 text-center">Cargando documento...</p>
                    )}
                </div>

                {/* Botón para cerrar el modal */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleClose}
                        className="bg-[#004080] text-white rounded-full px-4 py-2 hover:bg-opacity-90 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShowApplicationByUserModal;
