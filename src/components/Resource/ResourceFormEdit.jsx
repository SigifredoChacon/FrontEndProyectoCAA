import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateResource } from '../../services/resourceService.jsx';

function ResourceFormEdit({ selectedResource, onResourceUpdated }) {
    const [resource, setResource] = useState(selectedResource);

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
            setResource((prevResource) => ({ ...prevResource, [name]: value }));
    };

    const handleUpdateResource = async () => {
        try {
            const resourceToUpdate = convertFirstLetterToLowerCase(resource);
            const initialResourceLowerCase = convertFirstLetterToLowerCase(selectedResource);

            // Filtra solo los campos que han cambiado
            const updatedFields = Object.keys(resourceToUpdate).reduce((acc, key) => {
                if (resourceToUpdate[key] !== initialResourceLowerCase[key]) {
                    acc[key] = resourceToUpdate[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating resource with data:', updatedFields);
                console.log('Resource to update:', resourceToUpdate.idRecursos);
                await updateResource(selectedResource.idRecursos, updatedFields); // Actualiza solo los campos que han cambiado
                onResourceUpdated(); // Notifica al componente padre que recurso ha sido actualizada
            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar recurso:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateResource(); // Llama a la función de actualización
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Recurso</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="idRecursos" className="block text-sm font-medium text-gray-700">
                            idRecursos
                        </label>
                        <input
                            type="text"
                            name="idRecursos"
                            id="idRecursos"
                            value={resource.idRecursos}
                            onChange={handleChange}
                            placeholder="idRecursos"
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
                            value={resource.Nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => onResourceUpdated()}
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

ResourceFormEdit.propTypes = {
    selectedResource: PropTypes.object,
    onResourceUpdated: PropTypes.func.isRequired,
};

export default ResourceFormEdit;
