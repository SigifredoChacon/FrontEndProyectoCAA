import React, { useEffect, useState } from 'react';
import api from '../../../utils/api.js';

// Componente modal para aceptar o rechazar una solicitud, mostrando un PDF adjunto y
// permitiendo al usuario añadir una justificación al rechazar.
// Props:
// - open: booleano para controlar si el modal está abierto.
// - handleClose: función para cerrar el modal.
// - archivoSolicitud: string con la ruta del archivo PDF de la solicitud.
// - handleAcceptApplication: función que gestiona la aceptación de la solicitud.
// - handleRejectApplication: función que gestiona el rechazo de la solicitud.
function AcceptApplicationModal({ open, handleClose, archivoSolicitud, handleAcceptApplication, handleRejectApplication }) {
    // Estado que almacena la URL del PDF para la vista previa
    const [pdfUrl, setPdfUrl] = useState(null);

    // Estado que contiene la justificación ingresada para el rechazo de la solicitud
    const [justification, setJustification] = useState('');

    // Estado para almacenar y mostrar mensajes de error relacionados con la justificación
    const [error, setError] = useState('');

    // useEffect para configurar el PDF y resetear el estado cuando el modal se abre
    // Dependencias: open y archivoSolicitud
    useEffect(() => {
        // Si el modal está abierto y hay un archivo de solicitud, se configura la URL del PDF
        if (open && archivoSolicitud) {
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
        // Resetea el error y la justificación cuando el modal se abre
        if (open) {
            setError('');
            setJustification('');
        }
    }, [open, archivoSolicitud]);

    // Maneja el rechazo de la solicitud al verificar que haya una justificación
    // Si la justificación está vacía, muestra un mensaje de error
    const handleRejectClick = () => {
        if (!justification) {
            setError('La justificación es obligatoria para rechazar.');
        } else {
            setError('');
            handleRejectApplication(justification);
        }
    };

    // Si el modal no está abierto, no se renderiza nada
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-6xl w-full lg:w-10/12 shadow-lg flex flex-col lg:flex-row">

                {/* Mensaje para usuarios de pantallas pequeñas con opción para descargar el PDF */}
                <div className="block md:hidden text-center text-gray-500 mb-4">
                    <p className="mb-4">Por favor, cambia a una pantalla más grande para ver la vista previa del
                        documento PDF o descárgalo.</p>
                    <a
                        href={pdfUrl}
                        download
                        className="text-blue-500 underline hover:text-blue-600"
                    >
                        Descargar PDF
                    </a>
                </div>

                {/* Vista previa del PDF para pantallas medianas y grandes */}
                <div className="hidden md:block w-full md:w-2/3 h-[80vh]">
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

                {/* Sección de justificación y botones de acción */}
                <div className="w-full lg:w-1/3 lg:pl-6 flex flex-col justify-center mt-4 lg:mt-0">
                    <div className="mb-4 text-center lg:text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Justificación (requerida solo para rechazar):
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Escriba la justificación aquí..."
                            className="w-full h-12 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Botones para cerrar, rechazar o aceptar la solicitud */}
                    <div className="flex justify-center lg:justify-end gap-4">
                        <button
                            onClick={handleClose}
                            className="bg-pantone-blue text-white rounded-full px-4 py-2 hover:bg-pantone-blue/80 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleRejectClick}
                            className="bg-pantone-red text-white rounded-full px-4 py-2 hover:bg-pantone-red/80 transition-colors"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={handleAcceptApplication}
                            className="bg-pantone-blue text-white rounded-full px-4 py-2 hover:bg-pantone-blue/80 transition-colors"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcceptApplicationModal;
