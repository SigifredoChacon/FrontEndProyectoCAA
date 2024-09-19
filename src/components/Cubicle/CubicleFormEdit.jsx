import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateCubicle } from '../../services/cubicleService.jsx';

function CubicleFormEdit({ selectedCubicle, onCubicleUpdated }) {
    const [cubicle, setCubicle] = useState(selectedCubicle);

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Ventana') {
            setCubicle((prevCubicle) => ({
                ...prevCubicle,
                [name]: value === '1' ? true : false // Convertir a booleano
            }));
        } else {
            setCubicle((prevCubicle) => ({ ...prevCubicle, [name]: value }));
        }
    };

    const handleUpdateCubicle = async () => {
        try {
            const cubicleToUpdate = convertFirstLetterToLowerCase(cubicle);
            const initialCubicleLowerCase = convertFirstLetterToLowerCase(selectedCubicle);

            // Filtra solo los campos que han cambiado
            const updatedFields = Object.keys(cubicleToUpdate).reduce((acc, key) => {
                if (cubicleToUpdate[key] !== initialCubicleLowerCase[key]) {
                    acc[key] = cubicleToUpdate[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating cubicle with data:', updatedFields);
                console.log('Cubicle to update:', cubicleToUpdate.idCubiculo);
                await updateCubicle(selectedCubicle.idCubiculo, updatedFields); // Actualiza solo los campos que han cambiado
                onCubicleUpdated(); // Notifica al componente padre que la cubiculo ha sido actualizada
            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar cubiculo:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateCubicle(); // Llama a la función de actualización
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Cubiculo</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="idCubiculo" className="block text-sm font-medium text-gray-700">
                            idCubiculo
                        </label>
                        <input
                            type="text"
                            name="idCubiculo"
                            id="idCubiculo"
                            value={cubicle.idCubiculo}
                            onChange={handleChange}
                            placeholder="idCubiculo"
                            required
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
                            value={cubicle.Ventana ? '1' : '0'} // Mostrar como '1' o '0' en el select
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="1">Tiene ventana</option>
                            <option value="0">No tiene ventana</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => onCubicleUpdated()}
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

CubicleFormEdit.propTypes = {
    selectedCubicle: PropTypes.object,
    onCubicleUpdated: PropTypes.func.isRequired,
};

export default CubicleFormEdit;
