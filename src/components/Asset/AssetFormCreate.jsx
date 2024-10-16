import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {createAsset} from '../../services/assetService';
import {getStates} from "../../services/stateService.jsx";
import {getCategories} from "../../services/categoryService.jsx";
import Swal from "sweetalert2";

const initialAssetState = {
    numeroPlaca: 0,
    nombre: '',
    descripcion: '',
    modelo: '',
    numeroSerie: '',
    marca: '',
    condicion:0, //este en un booleano
    idEstado: 0,
    idCategoria:0
};

function AssetFormCreate({onAssetCreated}) {
    const [asset, setAsset] = useState(initialAssetState);
    const [estados, setEstados] = useState([]);
    const [categorias, setCategorias] = useState([]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setAsset((prevAsset) => ({...prevAsset, [name]: value}));
    };

    useEffect(() => {
        fetchStates();
        fetchCategories();
    }, []);



    const fetchStates = async () => {
        try {
            const data = await getStates();
            setEstados(data);
        } catch (error) {
            console.error('Error al obtener estados:', error);
        }
    }

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategorias(data);
        } catch (error) {
            console.error('Error al obtener categorias:', error);
        }
    }


    const handleCreateAsset = async () => {
        try {

            const assetToCreate = {
                ...asset,
                idEstado: parseInt(asset.idEstado, 10),
                numeroPlaca: parseInt(asset.numeroPlaca, 10),
                idCategoria: parseInt(asset.idCategoria, 10),
                condicion: parseInt(asset.condicion, 10),
            };


            await createAsset(assetToCreate);
            setAsset(initialAssetState);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha creado el activo con éxito',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onAssetCreated();
            });
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: error.response.data.message,
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateAsset();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Agregar Activo</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="numeroPlaca" className="block text-sm font-medium text-gray-700">
                            Numero de placa
                        </label>
                        <input
                            type="number"
                            name="numeroPlaca"
                            id="numeroPlaca"
                            value={asset.numeroPlaca}
                            onChange={handleChange}
                            placeholder="Cédula/Carnet"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={asset.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            type="text"
                            name="descripcion"
                            id="descripcion"
                            value={asset.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                            Modelo
                        </label>
                        <input
                            type="text"
                            name="modelo"
                            id="modelo"
                            value={asset.modelo}
                            onChange={handleChange}
                            placeholder="Modelo"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="numeroSerie" className="block text-sm font-medium text-gray-700">
                            Número de Serie
                        </label>
                        <input
                            type="text"
                            name="numeroSerie"
                            id="numeroSerie"
                            value={asset.numeroSerie}
                            onChange={handleChange}
                            placeholder="Número de Serie"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                            Marca
                        </label>
                        <input
                            type="text"
                            name="marca"
                            id="marca"
                            value={asset.marca}
                            onChange={handleChange}
                            placeholder="Marca"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="condicion" className="block text-sm font-medium text-gray-700">
                            Condición
                        </label>
                        <select
                            name="condicion"
                            id="condicion"
                            value={asset.condicion}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="1">Prestado</option>
                            <option value="0">Disponible</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="idEstado" className="block text-sm font-medium text-gray-700">
                            ID Estado
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
                            ID Categoria
                        </label>
                        <select
                            name="idCategoria"
                            id="idCategoria"
                            value={asset.idCategoria}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccione una categoria</option>
                            {categorias.map((categoty) => (
                                <option key={categoty.idCategoria} value={categoty.idCategoria}>
                                    {categoty.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => {
                            setAsset(initialAssetState);
                            onAssetCreated();
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>

    );
}


AssetFormCreate.propTypes = {
    onAssetCreated: PropTypes.func.isRequired,
};

export default AssetFormCreate;