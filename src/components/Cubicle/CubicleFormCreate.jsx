import {useEffect, useState} from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import {createCubicle} from '../../services/cubicleService.jsx';

// Define el ventana inicial del usuario
const initialCubicleState = {
    nombre: '',
    ventana: 0,
};

function CubicleFormCreate({onCubicleCreated}) {
    const [cubicle, setCubicle] = useState(initialCubicleState); // Ventana para el formulario del usuario

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setCubicle((prevCubicle) => ({...prevCubicle, [name]: value}));
    };


    // Maneja la creación de un nuevo usuario
    const handleCreateCubicle = async () => {
        try {
            const cubicleToCreate = {
                ...cubicle,
                idCubiculo: parseInt(cubicle.idCubiculo, 10),
                ventana: Boolean(parseInt(cubicle.ventana, 10)),
            };

            await createCubicle(cubicleToCreate); // Crea un nuevo usuario
            onCubicleCreated(); // Notifica al componente padre que el usuario ha sido creado
            setCubicle(initialCubicleState); // Limpia el formulario
        } catch (error) {
            console.error('Error al crear cubiculo:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateCubicle(); // Siempre llama a la función de creación
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Agregar Cubiculo</h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={cubicle.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de cubiculo"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="ventana" className="block text-sm font-medium text-gray-700">
                            Ventana
                        </label>
                        <select
                            name="ventana"
                            id="ventana"
                            value={cubicle.ventana}
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
                        onClick={() => {
                            setCubicle(initialCubicleState);
                            onCubicleCreated();
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

// Validación de PropTypes para el componente
CubicleFormCreate.propTypes = {
    onCubicleCreated: PropTypes.func.isRequired,
};

export default CubicleFormCreate;