import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateCubicle } from '../../services/cubicleService.jsx';
import Swal from "sweetalert2";

function CubicleFormEdit({ selectedCubicle, onCubicleUpdated }) {
    const [cubicle, setCubicle] = useState(selectedCubicle);

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Ventana') {
            setCubicle((prevCubicle) => ({
                ...prevCubicle,
                [name]: value === 'true' ? true : false
            }));

        }
        else if (name === 'Estado') {
            setCubicle((prevCubicle) => ({
                ...prevCubicle,
                [name]: value === 'true' ? true : false
            }));
        }
        else {
            setCubicle((prevCubicle) => ({ ...prevCubicle, [name]: value }));
        }
    };

    const handleUpdateCubicle = async () => {
        try {
            const cubicleToUpdate = convertFirstLetterToLowerCase(cubicle);
            const initialCubicleLowerCase = convertFirstLetterToLowerCase(selectedCubicle);


            const updatedFields = Object.keys(cubicleToUpdate).reduce((acc, key) => {
                if (cubicleToUpdate[key] !== initialCubicleLowerCase[key]) {
                    acc[key] = cubicleToUpdate[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length > 0) {
                await updateCubicle(selectedCubicle.idCubiculo, updatedFields);
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado la información del cubículo con éxito',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    onCubicleUpdated();
                });
            } else {
                await Swal.fire({
                    title: '¡Error!',
                    text: 'No se detectaron cambios',
                    icon: 'error',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
            }
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: 'Ya existe un cubículo con ese nombre',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });

        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateCubicle();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Cubiculo</h2>

                <div className="grid grid-cols-1 gap-y-6">

                    <div>
                        <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="Nombre"
                            id="Nombre"
                            value={cubicle.Nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Ventana" className="block text-sm font-medium text-gray-700">
                            Ventana
                        </label>
                        <select
                            name="Ventana"
                            id="Ventana"
                            value={cubicle.Ventana ? 'true' : 'false'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="true">Tiene ventana</option>
                            <option value="false">No tiene ventana</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="Estado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="Estado"
                            id="Estado"
                            value={cubicle.Estado ? 'true' : 'false'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Bloqueado</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => onCubicleUpdated()}
                    >
                        Cancelar
                    </button>
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

CubicleFormEdit.propTypes = {
    selectedCubicle: PropTypes.object,
    onCubicleUpdated: PropTypes.func.isRequired,
};

export default CubicleFormEdit;
