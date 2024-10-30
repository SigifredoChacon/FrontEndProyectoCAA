import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { updateAsset } from '../../services/assetService.jsx';
import { getStates } from "../../services/stateService.jsx";
import { getCategories } from "../../services/categoryService.jsx";
import Swal from "sweetalert2";

// Componente para editar un activo existente
// Props:
// - selectedAsset: objeto que contiene los datos del activo seleccionado para editar
// - onAssetUpdated: función que se llama después de actualizar el activo exitosamente
function AssetFormEdit({ selectedAsset, onAssetUpdated }) {
    // Estado para almacenar los datos del activo que se va a editar
    const [asset, setAsset] = useState(selectedAsset);

    // Estado para almacenar los estados disponibles para seleccionar
    const [estados, setEstados] = useState([]);

    // Estado para almacenar las categorías disponibles para seleccionar
    const [categorias, setCategorias] = useState([]);

    // Efecto para actualizar los datos del activo cuando cambia el activo seleccionado y cargar estados y categorías
    useEffect(() => {
        setAsset(selectedAsset);
        fetchStates();
        fetchCategories();
    }, [selectedAsset]);

    // Función para obtener los estados desde el servicio y actualizarlos en el estado local
    const fetchStates = async () => {
        try {
            const data = await getStates();
            setEstados(data);
        } catch (error) {
            console.error('Error al obtener estados:', error);
        }
    };

    // Función para obtener las categorías desde el servicio y actualizarlas en el estado local
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategorias(data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    // Convierte la primera letra de cada propiedad del objeto a minúscula
    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    // Maneja los cambios en los campos del formulario
    // Entrada: evento con el nombre del campo y su valor
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Condicion') {
            setAsset((prevAsset) => ({
                ...prevAsset,
                [name]: value === '1' ? true : false
            }));
        } else {
            setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
        }
    };

    // Actualiza el activo en el servidor solo si hay cambios y muestra notificación de éxito o error
    const handleUpdateAsset = async () => {
        try {
            const assetToUpdate = convertFirstLetterToLowerCase(asset);
            const initialAssetLowerCase = convertFirstLetterToLowerCase(selectedAsset);

            // Filtra los campos modificados para enviarlos en la actualización
            const updatedFields = Object.keys(assetToUpdate).reduce((acc, key) => {
                if (assetToUpdate[key] !== initialAssetLowerCase[key]) {
                    acc[key] = assetToUpdate[key];
                }
                return acc;
            }, {});

            // Convierte ciertos campos a números enteros si han cambiado
            if (updatedFields.idEstado) {
                updatedFields.idEstado = parseInt(updatedFields.idEstado, 10);
            }
            if (updatedFields.idCategoria) {
                updatedFields.idCategoria = parseInt(updatedFields.idCategoria, 10);
            }

            // Si hay campos modificados, actualiza el activo
            if (Object.keys(updatedFields).length > 0) {
                await updateAsset(selectedAsset.NumeroPlaca, updatedFields);
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado la información del activo con éxito',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    onAssetUpdated();
                });

            } else {
                // Si no hay cambios, muestra un mensaje de error
                await Swal.fire({
                    title: '¡Error!',
                    text: 'No se detectaron cambios',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            // Si ocurre un error, muestra un mensaje de error
            await Swal.fire({
                title: '¡Error!',
                text: 'No se pudo editar el activo',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    // Maneja el evento de envío del formulario y llama a la función de actualización
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateAsset();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* Formulario de edición de activo */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Activo</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="numeroPlaca" className="block text-sm font-medium text-gray-700">
                            Numero de placa
                        </label>
                        <input
                            type="number"
                            name="numeroPlaca"
                            id="numeroPlaca"
                            value={asset.NumeroPlaca}
                            onChange={handleChange}
                            placeholder="Numero de placa"
                            required
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            type="text"
                            name="Nombre"
                            id="Nombre"
                            value={asset.Nombre}
                            onChange={handleChange}
                            placeholder="Descripción"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">
                            Observaciones
                        </label>
                        <input
                            type="text"
                            name="Descripcion"
                            id="Descripcion"
                            value={asset.Descripcion}
                            onChange={handleChange}
                            placeholder="Observaciones"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Modelo" className="block text-sm font-medium text-gray-700">
                            Modelo
                        </label>
                        <input
                            type="text"
                            name="Modelo"
                            id="Modelo"
                            value={asset.Modelo}
                            onChange={handleChange}
                            placeholder="Modelo"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="NumeroSerie" className="block text-sm font-medium text-gray-700">
                            Número de Serie
                        </label>
                        <input
                            type="text"
                            name="NumeroSerie"
                            id="NumeroSerie"
                            value={asset.NumeroSerie}
                            onChange={handleChange}
                            disabled
                            placeholder="Número de Serie"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Marca" className="block text-sm font-medium text-gray-700">
                            Marca
                        </label>
                        <input
                            type="text"
                            name="Marca"
                            id="Marca"
                            value={asset.Marca}
                            onChange={handleChange}
                            placeholder="Marca"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Condicion" className="block text-sm font-medium text-gray-700">
                            Condición
                        </label>
                        <select
                            name="Condicion"
                            id="Condicion"
                            value={asset.Condicion ? '1' : '0'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="1">Prestado</option>
                            <option value="0">Disponible</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="idEstado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="idEstado"
                            id="idEstado"
                            value={asset.idEstado}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccione un Estado</option>
                            {estados.map((state) => (
                                <option key={state.idEstado} value={state.idEstado}>
                                    {state.Tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="idCategoria" className="block text-sm font-medium text-gray-700">
                            Categoría
                        </label>
                        <select
                            name="idCategoria"
                            id="idCategoria"
                            value={asset.idCategoria}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((category) => (
                                <option key={category.idCategoria} value={category.idCategoria}>
                                    {category.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    {/* Botón para cancelar */}
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => onAssetUpdated()}
                    >
                        Cancelar
                    </button>
                    {/* Botón para actualizar el activo */}
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-[#004080] focus:ring-offset-2"
                    >
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}

// Especifica los tipos de las props para el componente
AssetFormEdit.propTypes = {
    selectedAsset: PropTypes.object,
    onAssetUpdated: PropTypes.func.isRequired,
};

export default AssetFormEdit;
