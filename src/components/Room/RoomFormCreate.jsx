import {useEffect, useState} from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import {createRoom} from '../../services/roomService.jsx';

// Define el estado inicial del usuario
const initialRoomState = {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Agregar Sala</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
                            Imagen
                        </label>
                        <input
                            type="text"
                            name="imagen"
                            id="imagen"
                            value={room.imagen}
                            onChange={handleChange}
                            placeholder="URL de la imagen"
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
                            value={room.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de la sala"
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
                            value={room.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción de la sala"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="restricciones" className="block text-sm font-medium text-gray-700">
                            Restricciones
                        </label>
                        <input
                            type="text"
                            name="restricciones"
                            id="restricciones"
                            value={room.restricciones}
                            onChange={handleChange}
                            placeholder="Restricciones"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="estado"
                            id="estado"
                            value={room.estado}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="1">Activado</option>
                            <option value="0">Desactivado</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => {
                            setRoom(initialRoomState);
                            onRoomCreated();
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
RoomFormCreate.propTypes = {
    onRoomCreated: PropTypes.func.isRequired,
};

export default RoomFormCreate;