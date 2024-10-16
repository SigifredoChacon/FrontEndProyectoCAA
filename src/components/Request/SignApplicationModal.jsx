import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { saveAs } from 'file-saver';
import {updateRequestWithFile} from "../../services/requestService.jsx";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

function SignApplicationModal({ open, handleClose, archivoSolicitud, request,handleAcceptApplication }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && archivoSolicitud) {
            // Construye la URL completa del PDF
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
        if(open){
            setIsSubmitted(false);
        }

    }, [open, archivoSolicitud]);


    const handleDownloadPDF = () => {
        saveAs(pdfUrl, 'SolicitudCompleta.pdf');
        setIsSubmitted(true);
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
    };

    const handleUpdateSubmit = async () => {
        const formData = new FormData();
        formData.append("estado", "Firmado");
        formData.append("archivoSolicitud", file);

        try {

            const response = await updateRequestWithFile(request.idSolicitud, formData);

            if (response) {
                handleAcceptApplication();
                await Swal.fire({
                    title: '¡Actualización Exitosa!',
                    text: 'La solicitud se ha actualizado correctamente.',
                    icon: 'success',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        handleClose();
                    }
                });
            } else {
                console.error("Error al actualizar la solicitud");
            }
        } catch (error) {
            console.error("Error en la solicitud de actualización:", error);
        }
    };


    const handleFinalSubmit = async () => {}

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-5xl w-11/12 shadow-lg flex flex-col lg:flex-row">

                {/* Contenedor del PDF */}
                <div className="relative w-full lg:w-2/3 h-[80vh]">
                    {/* Botón de descarga en la parte superior derecha */}
                    <button
                        className="absolute top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                        onClick={handleDownloadPDF}>
                        Descargar PDF
                    </button>
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
                        {isSubmitted  && (
                            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">Subir
                                    archivo firmado</label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    accept="application/pdf"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#004080] file:text-white hover:file:bg-[#003060] file:rounded-md"
                                />
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        disabled={!fileUploaded}
                                        onClick={handleUpdateSubmit}
                                        className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${fileUploaded ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' : 'bg-gray-400'}`}
                                    >
                                        Enviar Solicitud Completa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleClose}
                            className="bg-[#004080] text-white rounded-full px-4 py-2 hover:bg-opacity-90 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignApplicationModal;
