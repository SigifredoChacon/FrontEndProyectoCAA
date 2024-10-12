import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

registerLocale("es", es);

export function AssetRequestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};
    const [formData, setFormData] = useState({
        usoBien: "",
        observaciones: ""
    });
    const [timePeriod, setTimePeriod] = useState("week");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ ...formData, startDate, endDate });
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
                                <option value="1">Nivel interno de la institución</option>
                                <option value="2">Nivel externo de la institución dentro del país</option>
                                <option value="3">Nivel externo de la institución fuera del país</option>
                                <option value="4">Reparación o Garantía</option>
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
                            {timePeriod === 'week' && (
                                <>
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
                                </>
                            )}
                            {timePeriod === 'month' && (
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    placeholderText="Selecciona el mes"
                                    locale="es"
                                    className="border border-gray-300 rounded-md p-2"
                                />
                            )}
                            {timePeriod === 'year' && (
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    placeholderText="Selecciona el año"
                                    locale="es"
                                    className="border border-gray-300 rounded-md p-2"
                                />
                            )}
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
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
