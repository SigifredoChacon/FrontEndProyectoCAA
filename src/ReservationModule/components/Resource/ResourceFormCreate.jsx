import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {createResource} from '../../services/resourceService.jsx';
import Swal from "sweetalert2";


const initialResourceState = {
    nombre: '',
    ventana: 0,
};

function ResourceFormCreate({onResourceCreated}) {
    const [resource, setResource] = useState(initialResourceState);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setResource((prevResource) => ({...prevResource, [name]: value}));
    };



    const handleCreateResource = async () => {
        try {
            const resourceToCreate = {
                ...resource,
                idRecursos: parseInt(resource.idRecursos, 10),
            };

            await createResource(resourceToCreate);
            setResource(initialResourceState);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha creado el recurso con éxito',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onResourceCreated();
            });
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: 'Recurso existente con ese nombre',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateResource();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Agregar Recurso</h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={resource.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de recurso"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => {
                            setResource(initialResourceState);
                            onResourceCreated();
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-[#004080] focus:ring-offset-2"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>
    );

}

ResourceFormCreate.propTypes = {
    onResourceCreated: PropTypes.func.isRequired,
};

export default ResourceFormCreate;