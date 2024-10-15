import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

function ShowRequestByUserModal({ open, handleClose, archivoSolicitud }) {
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

export default ShowRequestByUserModal;
