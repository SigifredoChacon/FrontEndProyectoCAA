import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import {createRequest} from "../services/requestService.jsx";

registerLocale("es", es);
const initialRequestState = {
    estado: 'Espera',
    idUsuario: 2021080289,
    idActivo: 182732645,
    archivoSolicitud: '',
    fechaInicio: '',
    FechaFin: ''
};
export function AssetRequestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};
    const [formData, setFormData] = useState({
        usoBien: "",
        observaciones: ""
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [request, setRequest] = useState(initialRequestState);
    const [file, setFile] = useState(null);


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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
        console.log("Archivo firmado subido:", uploadedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        console.log({ ...formData, startDate, endDate });
    };

    const handleCreateRequest = async () => {
        setRequest({...request, fechaInicio: startDate, FechaFin: endDate});
        if (!file || !startDate || !endDate) {
            alert("Por favor completa el formulario y carga el archivo antes de enviar la solicitud.");
            return;
        }

        // Crear un FormData para enviar el archivo y los datos al backend
        const formData = new FormData();
        formData.append("estado", request.estado);
        formData.append("idUsuario", parseInt(request.idUsuario, 10));  // Convertir a número
        formData.append("idActivo", parseInt(request.idActivo, 10));
        formData.append("fechaInicio", startDate.toISOString());  // Convertir las fechas a formato ISO
        formData.append("fechaFin", endDate.toISOString());
        formData.append("archivoSolicitud", file);  // Agregar el archivo al FormData

        try {
            // Llamar a createRequest en lugar de fetch
            const response = await createRequest(formData);
            if (response.status === 201) {
                const data = response.data;
                console.log("Solicitud creada exitosamente:", data);
                navigate('/categoryAssets');  // Redirigir después de la solicitud exitosa
            } else {
                console.error("Error al crear la solicitud");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800">{getTitle()}</h1>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Formulario de Solicitud</h2>

                    <div className="grid grid-cols-1 gap-y-6">
                        <div>
                            <label htmlFor="usoBien" className="block text-sm font-medium text-gray-700">
                                Uso del Bien
                            </label>
                            <select
                                name="usoBien"
                                id="usoBien"
                                value={formData.usoBien}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="1. Nivel interno de la institución">Nivel interno de la institución
                                </option>
                                <option value="2. Nivel externo de la institución dentro del país">Nivel externo de la
                                    institución dentro del país
                                </option>
                                <option value="3. Nivel externo de la institución fuera del país">Nivel externo de la
                                    institución fuera del país
                                </option>
                                <option value="4. Reparación o Garantía">Reparación o Garantía</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                                Observaciones
                            </label>
                            <textarea
                                name="observaciones"
                                id="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                placeholder="Escriba sus observaciones aquí"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex justify-center gap-4 mb-6">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Fecha de inicio"
                                locale="es"
                                className="border border-gray-300 rounded-md p-2"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Fecha de fin"
                                locale="es"
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                            onClick={() => navigate('/categoryAssets')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            Generar PDF
                        </button>
                    </div>

                    {/* Botón para subir archivo, visible solo después del envío */}
                    {isSubmitted && (
                        <div className="mt-6">
                            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
                            Subir archivo firmado
                            </label>
                            <input
                                type="file"
                                id="fileUpload"
                                accept="application/pdf" // Restricción solo a archivos PDF
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#004080] file:text-white hover:file:bg-[#003060] file:rounded-md"
                            />
                        </div>
                    )}

                    {/* Botón final de envío, deshabilitado hasta que se suba el archivo */}
                    {isSubmitted && (
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                disabled={!fileUploaded}
                                onClick={handleCreateRequest}
                                className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    fileUploaded ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' : 'bg-gray-400'
                                }`}
                            >
                                Enviar Solicitud Completa
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
