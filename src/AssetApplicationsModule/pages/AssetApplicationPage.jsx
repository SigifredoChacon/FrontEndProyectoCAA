import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { createApplication } from "../services/applicationService.jsx";
import { saveAs } from 'file-saver';
import { generateFilledPDF } from '../components/Asset/pdfUtils.js';
import { useAuthContext } from "../../SecurityModule/hooks/useAuthContext.js";
import { getUserById } from "../../SecurityModule/services/userService.jsx";
import { getFirstAvailableAsset, updateAsset } from "../services/assetService.jsx";
import Swal from "sweetalert2";

registerLocale("es", es); // Registra el idioma español para el selector de fechas

const initialRequestState = {
    estado: 'Pendiente',
    idUsuario: 0,
    idActivo: 0,
    archivoSolicitud: '',
    fechaInicio: '',
    FechaFin: ''
};

export function AssetApplicationPage() {
    const location = useLocation(); // Obtiene información sobre la ruta actual
    const navigate = useNavigate(); // Hook para redireccionar
    const { user } = useAuthContext(); // Obtiene el usuario autenticado desde el contexto
    const { id } = location.state || {}; // Obtiene el ID del activo desde la ubicación
    const [formData, setFormData] = useState({
        usoBien: "",
        observaciones: "",
        accesorios: ""
    });
    const [startDate, setStartDate] = useState(null); // Almacena la fecha de inicio
    const [endDate, setEndDate] = useState(null); // Almacena la fecha de fin
    const [isSubmitted, setIsSubmitted] = useState(false); // Indica si se ha enviado la solicitud
    const [fileUploaded, setFileUploaded] = useState(false); // Indica si el archivo ha sido cargado
    const [request, setRequest] = useState(initialRequestState); // Estado inicial de la solicitud
    const [file, setFile] = useState(null); // Almacena el archivo PDF firmado
    const [isFormLocked, setIsFormLocked] = useState(false); // Bloquea el formulario tras generar el PDF
    const [pdfPreview, setPdfPreview] = useState(null); // Almacena la URL de vista previa del PDF
    const [currentAssetId, setCurrentAssetId] = useState(null); // Almacena el ID del activo actual

    localStorage.setItem("isRequestCompleted", JSON.stringify(false));

    useEffect(() => {
        const handleUnload = () => {
            const isCompleted = JSON.parse(localStorage.getItem("isRequestCompleted"));
            if (currentAssetId && !isCompleted) {
                updateAsset(currentAssetId, { condicion: false }); // Restaura la condición del activo si no se completó la solicitud
                localStorage.setItem("isRequestCompleted", JSON.stringify(false));
            }
        };

        window.addEventListener("beforeunload", handleUnload); // Restaura el activo al salir de la página

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            const isCompleted = JSON.parse(localStorage.getItem("isRequestCompleted"));
            if (currentAssetId && !isCompleted) {
                updateAsset(currentAssetId, { condicion: false });
                localStorage.setItem("isRequestCompleted", JSON.stringify(false));
            }
        };
    }, [currentAssetId]);

    // Retorna el título de la solicitud dependiendo del ID del activo
    // Entrada: ninguna
    // Salida: string que representa el título de la solicitud
    const getTitle = () => {
        switch (id) {
            case 1:
                return "Solicitud de Laptop";
            case 2:
                return "Solicitud de Proyector";
            case 3:
                return "Solicitud de Monitor";
            default:
                return "Solicitud de Activo";
        }
    };

    // Maneja los cambios en el formulario
    // Entrada: evento del formulario
    // Salida: actualiza formData con el nuevo valor
    const handleChange = (e) => {
        if (!isFormLocked) {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Almacena el archivo PDF firmado cargado por el usuario
    // Entrada: archivo cargado por el usuario
    // Salida: actualiza el estado de file y fileUploaded
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
    };

    // Maneja el envío inicial del formulario para marcar el estado como enviado
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    // Genera una nueva solicitud y un PDF con los detalles de la solicitud
    // Entrada: ninguna
    // Salida: actualiza el estado de la solicitud y muestra vista previa del PDF
    const handleCreateRequest = async () => {
        setRequest({ ...request, fechaInicio: startDate, FechaFin: endDate });
        try {
            if (!startDate || !endDate || formData.usoBien === ""){
                Swal.fire({
                    title: '¡Error!',
                    text: 'Completa el formulario para continuar',
                    icon: 'error',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            const userData = await getUserById(user); // Obtiene los datos del usuario actual

            let assetData;
            // Verifica el ID del activo para obtener el primer activo disponible
            if (id === 1) {
                assetData = await getFirstAvailableAsset('Laptop');
            } else if (id === 2) {
                assetData = await getFirstAvailableAsset('Proyector');
            } else if (id === 3) {
                assetData = await getFirstAvailableAsset('Monitor');
            }

            // Genera el PDF y muestra la vista previa
            const pdfBytes = await generateFilledPDF(userData, formData, assetData, startDate, endDate);
            const pdfBlob = new Blob([pdfBytes], {type: "application/pdf"});
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setRequest({...request, idUsuario: user, idActivo: assetData.NumeroPlaca});
            setPdfPreview(pdfUrl);
            setIsFormLocked(true);

            // Marca el activo como "en uso"
            if (assetData?.NumeroPlaca) {
                await updateAsset(assetData.NumeroPlaca, {condicion: true});
                setCurrentAssetId(assetData.NumeroPlaca);
            }
        } catch (error) {
            Swal.fire({
                title: '¡Error!',
                text: 'No hay activos disponibles',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            });
        }
    };

    // Descarga el PDF de la solicitud
    const handleDownloadPDF = () => {
        saveAs(pdfPreview, 'SolicitudCompleta.pdf');
        setIsSubmitted(true);
    };

    // Permite volver a editar el formulario
    const handleBackToEdit = async() => {
        setIsFormLocked(false);
        setPdfPreview(null);
        setIsSubmitted(false);
        setFileUploaded(false);
        await updateAsset(currentAssetId, { condicion: false });
    };

    // Maneja el envío final de la solicitud con el archivo firmado
    const handleFinalSubmit = async () => {
        const formData = new FormData();
        formData.append("estado", request.estado);
        formData.append("idUsuario", parseInt(request.idUsuario, 10));
        formData.append("idActivo", parseInt(request.idActivo, 10));
        formData.append("fechaInicio", startDate.toISOString());
        formData.append("fechaFin", endDate.toISOString());
        formData.append("archivoSolicitud", file);

        try {
            const response = await createApplication(formData);
            if (response.status === 201) {
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu solicitud se ha enviado correctamente',
                    icon: 'success',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        localStorage.setItem("isRequestCompleted", JSON.stringify(true));
                        navigate('/categoryAssets');
                    }
                });
            } else {
                console.error("Error al crear la solicitud");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    // Interfaz de usuario
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 p-4">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 lg:space-y-6 p-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{getTitle()}</h1>

                {/* Vista previa del PDF */}
                {pdfPreview && (
                    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">Vista previa del PDF</h3>

                        <div className="hidden md:block">
                            <iframe
                                src={pdfPreview}
                                width="100%"
                                height="400px"
                                title="Vista previa PDF"
                                className="rounded-md border border-gray-300 md:h-[600px] lg:h-[800px]"
                            ></iframe>
                        </div>

                        <div className="block md:hidden text-center">
                            <label>Descargue el PDF para verlo</label>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between">
                            <button className="bg-gray-400 text-white py-2 px-4 rounded-md mb-4 sm:mb-0 sm:mr-2"
                                    onClick={handleBackToEdit}>
                                Volver a Editar
                            </button>
                            <button className="bg-green-500 text-white py-2 px-4 rounded-md"
                                    onClick={handleDownloadPDF}>
                                Descargar PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Formulario de solicitud */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 lg:p-8 space-y-4 lg:space-y-6">
                <form onSubmit={handleSubmit} className="bg-white p-4 lg:p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-lg lg:text-xl font-semibold leading-7 text-gray-900 text-center mb-4">Formulario de Solicitud</h2>

                    {!pdfPreview ? (
                        <>
                            {/* Campos del formulario */}
                            <div className="grid grid-cols-1 gap-y-4 lg:gap-y-6">
                                {/* Uso del Bien */}
                                <div>
                                    <label htmlFor="usoBien" className="block text-sm font-medium text-gray-700">Uso del Bien</label>
                                    <select
                                        name="usoBien"
                                        id="usoBien"
                                        value={formData.usoBien}
                                        onChange={handleChange}
                                        required
                                        disabled={isFormLocked}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="" disabled selected>Seleccione una opción</option>
                                        <option value="1">Nivel interno</option>
                                        <option value="2">Nivel externo dentro del país</option>
                                        <option value="3">Nivel externo fuera del país</option>
                                        <option value="4">Reparación o Garantía</option>
                                    </select>
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        id="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        placeholder="Escriba sus observaciones aquí"
                                        required
                                        disabled={isFormLocked}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {/* Accesorios */}
                                <div>
                                    <label htmlFor="accesorios" className="block text-sm font-medium text-gray-700">Accesorios</label>
                                    <textarea
                                        name="accesorios"
                                        id="accesorios"
                                        value={formData.accesorios}
                                        onChange={handleChange}
                                        placeholder="Ej: Teclado, mouse, etc."
                                        required
                                        disabled={isFormLocked}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {/* Selección de fechas */}
                                Fecha de uso:
                                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                                                selectsStart startDate={startDate} endDate={endDate}
                                                placeholderText="Fecha de inicio" locale="es"
                                                className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"/>
                                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd
                                                startDate={startDate} endDate={endDate} placeholderText="Fecha de fin"
                                                locale="es"
                                                className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"/>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
                                <button type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        onClick={() => navigate('/categoryAssets')}>Cancelar
                                </button>
                                <button type="button" onClick={handleCreateRequest}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-offset-2">Generar PDF
                                </button>
                            </div>
                        </>
                    ) : null}
                </form>

                {/* Carga del archivo firmado y envío final */}
                {isSubmitted && pdfPreview && (
                    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">Subir archivo firmado</label>
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
                                onClick={handleFinalSubmit}
                                className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${fileUploaded ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' : 'bg-gray-400'}`}
                            >
                                Enviar Solicitud Completa
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
