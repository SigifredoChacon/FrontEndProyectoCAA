import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function AcceptApplicationModal({ open, handleClose, archivoSolicitud, handleAcceptApplication, handleRejectApplication }) {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (open && archivoSolicitud) {
            // Construye la URL completa del PDF
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
    }, [open, archivoSolicitud]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-11/12 md:w-3/4 lg:w-2/3 shadow-lg">
                <div className="relative w-full h-[80vh]">
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
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={handleRejectApplication}
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
    );
}

export default AcceptApplicationModal;
