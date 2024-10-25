import React, { useEffect, useState } from 'react';
import api from '../../../utils/api.js';
import { saveAs } from 'file-saver';
import {updateApplicationWithFile} from "../../services/applicationService.jsx";
import Swal from "sweetalert2";

// Componente modal para firmar una solicitud y subir el archivo de la solicitud firmada.
// Props:
// - open: booleano que controla si el modal está visible.
// - handleClose: función para cerrar el modal.
// - archivoSolicitud: string con la ruta del archivo PDF de la solicitud.
// - request: objeto con los detalles de la solicitud que se va a firmar.
// - handleAcceptApplication: función para gestionar la aceptación de la solicitud tras la firma.
function SignApplicationModal({ open, handleClose, archivoSolicitud, request, handleAcceptApplication }) {
    // Estado para almacenar la URL del PDF a mostrar
    const [pdfUrl, setPdfUrl] = useState(null);

    // Estado para controlar si se ha hecho clic en "Descargar PDF"
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Estado para verificar si un archivo se ha cargado
    const [fileUploaded, setFileUploaded] = useState(false);

    // Estado para almacenar el archivo subido
    const [file, setFile] = useState(null);


    // useEffect que configura la URL del PDF y resetea el estado cuando el modal se abre
    useEffect(() => {
        // Si el modal está abierto y hay un archivo de solicitud, configura la URL del PDF
        if (open && archivoSolicitud) {
            setPdfUrl(`${api.defaults.baseURL}/${archivoSolicitud.replace(/\\/g, '/')}`);
        }
        // Resetea el estado de isSubmitted cuando se abre el modal
        if(open){
            setIsSubmitted(false);
        }
    }, [open, archivoSolicitud]);

    // Maneja la descarga del PDF actual
    // Establece isSubmitted a true una vez que el PDF se descarga
    const handleDownloadPDF = () => {
        saveAs(pdfUrl, 'SolicitudCompleta.pdf');
        setIsSubmitted(true);
    };

    // Maneja la carga del archivo PDF firmado
    // Entrada: evento que contiene el archivo cargado
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
    };

    // Envía la solicitud firmada al backend y actualiza el estado de la solicitud
    const handleUpdateSubmit = async () => {
        const formData = new FormData();
        formData.append("estado", "Firmado");
        formData.append("archivoSolicitud", file);

        try {
            // Llama a la función de servicio para actualizar la solicitud con el archivo subido
            const response = await updateApplicationWithFile(request.idSolicitud, formData);

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

    // Función de manejo para la presentación final de la solicitud (aún no implementada)
    const handleFinalSubmit = async () => {}

    // Si el modal no está abierto, retorna null para no renderizar nada
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-5xl w-11/12 shadow-lg flex flex-col lg:flex-row">

                {/* Vista previa del PDF y botón de descarga */}
                <div className="relative w-full lg:w-2/3 h-[80vh] hidden lg:block">
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

                {/* Sección para carga de archivo firmado y botones de acción */}
                <div className="w-full lg:w-1/3 lg:pl-6 flex flex-col justify-center mt-4 lg:mt-0">
                    <div className="lg:hidden text-center mb-4">
                        <p className="text-gray-500 mb-2">
                            Por favor, cambia a una pantalla más grande para ver la vista previa del documento PDF o descárgalo.
                        </p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                            onClick={handleDownloadPDF}
                        >
                            Descargar PDF
                        </button>
                    </div>

                    <div className="mb-4">
                        {/* Muestra el campo de carga de archivo solo después de descargar el PDF */}
                        {isSubmitted && (
                            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mx-auto">
                                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subir archivo firmado
                                </label>
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

                    {/* Botón para cerrar el modal */}
                    <div className="flex justify-center lg:justify-end gap-4">
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
