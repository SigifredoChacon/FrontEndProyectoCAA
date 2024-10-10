import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateAsset } from '../../services/assetService';
import {getRoles} from "../../services/roleService.jsx";
import {getStates} from "../../services/stateService.jsx";
import {getCategories} from "../../services/categoryService.jsx";

function AssetFormEdit({ selectedAsset, onAssetUpdated}) {
    const [asset, setAsset] = useState(selectedAsset);
    const [estados, setEstados] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setAsset(selectedAsset);
        fetchStates();
        fetchCategories();
    }, [selectedAsset]);


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

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Condicion') {
            setAsset((prevAsset) => ({
                ...prevAsset,
                [name]: value === '1' ? true : false
            }));
        }
        else {
            setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
        }
    };

    const handleUpdateAsset = async () => {
        try {
            const assetToUpdate = convertFirstLetterToLowerCase(asset);
            const initialAssetLowerCase = convertFirstLetterToLowerCase(selectedAsset);


            const updatedFields = Object.keys(assetToUpdate).reduce((acc, key) => {
                if (assetToUpdate[key] !== initialAssetLowerCase[key]) {
                    acc[key] = assetToUpdate[key];
                }
                return acc;
            }, {});
            if (updatedFields.idEstado) {
                updatedFields.idEstado = parseInt(updatedFields.idEstado, 10);
            }
            if (updatedFields.idCategoria) {
                updatedFields.idCategoria = parseInt(updatedFields.idCategoria, 10);
            }

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating asset with data:', updatedFields);
                console.log('Asset to update:', assetToUpdate.NumeroPlaca);
                await updateAsset(selectedAsset.NumeroPlaca, updatedFields);
                onAssetUpdated();

            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar activo:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateAsset();
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="Nombre"
                            id="Nombre"
                            value={asset.Nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            type="text"
                            name="Descripcion"
                            id="Descripcion"
                            value={asset.Descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
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
                            value={asset.Condicion}
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
                            {categorias.map((category) => (
                                <option key={category.idCategoria} value={category.idCategoria}>
                                    {category.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => onAssetUpdated()}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Actualizar
                    </button>
                </div>
            </form>
        </div>


    );
}

AssetFormEdit.propTypes = {
    selectedAsset: PropTypes.object,
    onAssetUpdated: PropTypes.func.isRequired,
};

export default AssetFormEdit;
