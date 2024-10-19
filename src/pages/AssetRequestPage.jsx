import { useLocation, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { createRequest } from "../services/requestService";
import { saveAs } from 'file-saver';
import { generateFilledPDF } from '../components/Asset/pdfUtils';
import { useAuthContext } from "../hooks/useAuthContext.js";
import { getUserById } from "../services/userService.jsx";
import {getFirstAvailableAsset, updateAsset} from "../services/assetService.jsx";
import Swal from "sweetalert2";

registerLocale("es", es);

const initialRequestState = {
    estado: 'Pendiente',
    idUsuario: 0,
    idActivo: 0,
    archivoSolicitud: '',
    fechaInicio: '',
    FechaFin: ''
};

export function AssetRequestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { id } = location.state || {};
    const [formData, setFormData] = useState({
        usoBien: "",
        observaciones: "",
        accesorios: ""
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [request, setRequest] = useState(initialRequestState);
    const [file, setFile] = useState(null);
    const [isFormLocked, setIsFormLocked] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [currentAssetId, setCurrentAssetId] = useState(null);



    useEffect(() => {
        const handleUnload = () => {
            const isCompleted = JSON.parse(localStorage.getItem("isRequestCompleted"));
            if (currentAssetId && !isCompleted) {
                updateAsset(currentAssetId, { condicion: 0 }); // Cambia a "Disponible" si se sale
            }
        };

        // Detectar salida de la página y cierre del navegador
        window.addEventListener("beforeunload", handleUnload);

        // Limpiar el evento y cambiar el estado a "Disponible" cuando el usuario navegue a otra página
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            const isCompleted = JSON.parse(localStorage.getItem("isRequestCompleted"));
            if (currentAssetId && !isCompleted) {
                updateAsset(currentAssetId, { condicion: 0 });
            }
        };
    }, [currentAssetId]);


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

    const handleChange = (e) => {
        if (!isFormLocked) {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const handleCreateRequest = async () => {

        setRequest({ ...request, fechaInicio: startDate, FechaFin: endDate });
        try {
            if (!startDate || !endDate) {
                Swal.fire({
                    title: '¡Error!',
                    text: 'Completa el formulario para continuar',
                    icon: 'error',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            const userData = await getUserById(user);

            let assetData;

            if (id === 1) {
                assetData = await getFirstAvailableAsset('Laptop');
            } else if (id === 2) {
                assetData = await getFirstAvailableAsset('Proyector');
            } else if (id === 3) {
                assetData = await getFirstAvailableAsset('Monitor');
            }

            const pdfBytes = await generateFilledPDF(userData, formData, assetData, startDate, endDate);
            const pdfBlob = new Blob([pdfBytes], {type: "application/pdf"});
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setRequest({...request, idUsuario: user, idActivo: assetData.NumeroPlaca});
            setPdfPreview(pdfUrl);
            setIsFormLocked(true);

            // Cambiar idEstado a 1 ("Prestado")
            if (assetData?.NumeroPlaca) {
                await updateAsset(assetData.NumeroPlaca, {condicion: 1});
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

    const handleDownloadPDF = () => {
        saveAs(pdfPreview, 'SolicitudCompleta.pdf');
        setIsSubmitted(true);
    };

    const handleBackToEdit = async() => {
        setIsFormLocked(false);
        setPdfPreview(null);
        setIsSubmitted(false);
        setFileUploaded(false);
        await updateAsset(currentAssetId, { condicion: 0 });
    };

    const handleFinalSubmit = async () => {
        const formData = new FormData();
        formData.append("estado", request.estado);
        formData.append("idUsuario", parseInt(request.idUsuario, 10));
        formData.append("idActivo", parseInt(request.idActivo, 10));
        formData.append("fechaInicio", startDate.toISOString());
        formData.append("fechaFin", endDate.toISOString());
        formData.append("archivoSolicitud", file);

        try {
            const response = await createRequest(formData);
            if (response.status === 201) {

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu solicitud se ha enviado correctamente',
                    icon: 'success',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        localStorage.setItem("isRequestCompleted", JSON.stringify(true)); // Guardar el estado de completado en localStorage
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

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 p-4">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 lg:space-y-6 p-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{getTitle()}</h1>

                {pdfPreview && (
                    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">Vista previa del PDF</h3>

                        {/* Mostrar vista previa en `iframe` solo en pantallas medianas o más grandes */}
                        <div className="hidden md:block">
                            <iframe
                                src={pdfPreview}
                                width="100%"
                                height="400px"
                                title="Vista previa PDF"
                                className="rounded-md border border-gray-300 md:h-[600px] lg:h-[800px]"
                            ></iframe>
                        </div>

                        {/* Mostrar enlace de descarga solo en pantallas pequeñas */}
                        <div className="block md:hidden text-center">
                            <label>
                                Descargue el PDF para verlo
                            </label>
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


            <div
                className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 lg:p-8 space-y-4 lg:space-y-6">
                <form onSubmit={handleSubmit} className="bg-white p-4 lg:p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-lg lg:text-xl font-semibold leading-7 text-gray-900 text-center mb-4">Formulario
                        de Solicitud</h2>

                    {!pdfPreview ? (
                        <>
                            <div className="grid grid-cols-1 gap-y-4 lg:gap-y-6">
                                <div>
                                    <label htmlFor="usoBien" className="block text-sm font-medium text-gray-700">Uso del
                                        Bien</label>
                                    <select
                                        name="usoBien"
                                        id="usoBien"
                                        value={formData.usoBien}
                                        onChange={handleChange}
                                        required
                                        disabled={isFormLocked}
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >

                                        <option value="1">Nivel interno</option>
                                        <option value="2">Nivel externo dentro del país</option>
                                        <option value="3">Nivel externo fuera del país</option>
                                        <option value="4">Reparación o Garantía</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="observaciones"
                                           className="block text-sm font-medium text-gray-700">Observaciones</label>
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

                                <div>
                                    <label htmlFor="accesorios"
                                           className="block text-sm font-medium text-gray-700">Accesorios</label>
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

                            <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
                                <button type="button"
                                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                                        onClick={() => navigate('/categoryAssets')}>Cancelar
                                </button>
                                <button type="button" onClick={handleCreateRequest}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-offset-2">Generar
                                    PDF
                                </button>
                            </div>
                        </>
                    ) : null}
                </form>

                {isSubmitted && pdfPreview && (
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
