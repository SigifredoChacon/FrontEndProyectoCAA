import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function AcceptApplicationModal({ open, handleClose, archivoSolicitud, handleAcceptApplication, handleRejectApplication }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [justification, setJustification] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && archivoSolicitud) {
            // Construye la URL completa del PDF
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
        if (open) {
            setError('');
            setJustification('');
        }
    }, [open, archivoSolicitud]);

    const handleRejectClick = () => {
        if (!justification) {
            setError('La justificación es obligatoria para rechazar.');
        } else {
            setError('');
            handleRejectApplication(justification);
        }
    };


    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-5xl w-11/12 shadow-lg flex flex-col lg:flex-row">

                {/* Contenedor del PDF */}
                <div className="relative w-full lg:w-2/3 h-[80vh]">
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

                {/* Contenedor de Justificación y Botones */}
                <div className="w-full lg:w-1/3 lg:pl-6 flex flex-col justify-center mt-4 lg:mt-0">
                    {/* Área para la justificación */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Justificación (requerida solo para rechazar):
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Escriba la justificación aquí..."
                            className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleClose}
                            className="bg-[#004080] text-white rounded-full px-4 py-2 hover:bg-opacity-90 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleRejectClick}
                            className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition-colors"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={handleAcceptApplication}
                            className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600 transition-colors"
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
