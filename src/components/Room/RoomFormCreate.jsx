import {useEffect, useState} from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import {createRoom} from '../../services/roomService.jsx';

// Define el estado inicial del usuario
const initialRoomState = {
    idSala: 0,
    imagen: '',
    nombre: '',
    descripcion: '',
    restricciones: '',
    estado: 0,
};

function RoomFormCreate({onRoomCreated}) {
    const [room, setRoom] = useState(initialRoomState); // Estado para el formulario del usuario

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setRoom((prevRoom) => ({...prevRoom, [name]: value}));
    };


    // Maneja la creación de un nuevo usuario
    const handleCreateRoom = async () => {
        try {
            const roomToCreate = {
                ...room,
                idSala: parseInt(room.idSala, 10),
                estado: Boolean(parseInt(room.estado, 10)),
            };

            await createRoom(roomToCreate); // Crea un nuevo usuario
            onRoomCreated(); // Notifica al componente padre que el usuario ha sido creado
            setRoom(initialRoomState); // Limpia el formulario
        } catch (error) {
            console.error('Error al crear sala:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateRoom(); // Siempre llama a la función de creación
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Agregar Sala</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="idSala" className="block text-sm font-medium leading-6 text-gray-900">
                            idSala
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="idSala"
                                id="idSala"
                                value={room.idSala}
                                onChange={handleChange}
                                placeholder="idSala"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="imagen" className="block text-sm font-medium leading-6 text-gray-900">
                            Imagen
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="imagen"
                                id="imagen"
                                value={room.imagen}
                                onChange={handleChange}
                                placeholder="Imagen"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="nombre" className="block text-sm font-medium leading-6 text-gray-900">
                            Nombre
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                value={room.nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="descripcion" className="block text-sm font-medium leading-6 text-gray-900">
                            Descripción
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="descripcion"
                                id="descripcion"
                                value={room.descripcion}
                                onChange={handleChange}
                                placeholder="Descripcion"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="restricciones" className="block text-sm font-medium leading-6 text-gray-900">
                            Restricciones
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="restricciones"
                                id="restricciones"
                                value={room.restricciones}
                                onChange={handleChange}
                                placeholder="Restricciones"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="estado" className="block text-sm font-medium leading-6 text-gray-900">
                            Estado
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="estado"
                                id="estado"
                                value={room.estado}
                                onChange={handleChange}
                                placeholder="Estado"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => {setRoom(initialRoomState); onRoomCreated();}}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Agregar
                </button>
            </div>
        </form>

    );
}

// Validación de PropTypes para el componente
RoomFormCreate.propTypes = {
    onRoomCreated: PropTypes.func.isRequired,
};

export default RoomFormCreate;