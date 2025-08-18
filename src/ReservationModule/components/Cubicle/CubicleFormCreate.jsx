import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {createCubicle} from '../../services/cubicleService.jsx';
import Swal from "sweetalert2";


const initialCubicleState = {
    nombre: '',
    ventana: false,
    estado: true
};

function CubicleFormCreate({onCubicleCreated}) {
    const [cubicle, setCubicle] = useState(initialCubicleState);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setCubicle((prevCubicle) => ({...prevCubicle, [name]: value}));
    };



    const handleCreateCubicle = async () => {
        try {
            const cubicleToCreate = {
                ...cubicle,
                idCubiculo: parseInt(cubicle.idCubiculo, 10),
                ventana: Boolean(cubicle.ventana),
                estado: Boolean(cubicle.estado),
            };

            await createCubicle(cubicleToCreate);
            setCubicle(initialCubicleState);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha creado el cubículo con éxito',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onCubicleCreated();
            });
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: 'Cubículo existente con ese nombre',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateCubicle();
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
                            <option value="true">Tiene ventana</option>
                            <option value="false">No tiene ventana</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="estado"
                            id="estado"
                            value={cubicle.estado}
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
                        onClick={() => {
                            setCubicle(initialCubicleState);
                            onCubicleCreated();
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

CubicleFormCreate.propTypes = {
    onCubicleCreated: PropTypes.func.isRequired,
};

export default CubicleFormCreate;