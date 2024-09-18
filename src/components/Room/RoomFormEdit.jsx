import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateRoom } from '../../services/roomService.jsx';

function RoomFormEdit({ selectedRoom, onRoomUpdated}) {
    const [room, setRoom] = useState(selectedRoom); // Estado inicial con el usuario seleccionado

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            // Convierte solo la primera letra a minúscula y concatena el resto de la clave
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key]; // Asigna el valor al nuevo nombre de clave
            return acc;
        }, {});
    };

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom((prevRoom) => ({ ...prevRoom, [name]: value }));
    };

    const handleUpdateRoom = async () => {
        try {
            const roomToUpdate = convertFirstLetterToLowerCase(room); // Convierte las claves a minúsculas
            const initialRoomLowerCase = convertFirstLetterToLowerCase(selectedRoom); // Convierte las claves del usuario inicial a minúsculas

            // Filtra solo los campos que han cambiado
            const updatedFields = Object.keys(roomToUpdate).reduce((acc, key) => {
                if (roomToUpdate[key] !== initialRoomLowerCase[key]) {
                    acc[key] = roomToUpdate[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating user with data:', updatedFields);
                console.log('User to update:', roomToUpdate.idSala);
                await updateRoom(selectedRoom.idSala, updatedFields); // Actualiza solo los campos que han cambiado
                onRoomUpdated(); // Notifica al componente padre que el usuario ha sido actualizado

            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar sala:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateRoom(); // Llama a la función de actualización
    };


    // Aquí está el return para UserFormEdit
    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Editar Sala</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="idSala" className="block text-sm font-medium leading-6 text-gray-900">
                            idSala
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
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
                        <label htmlFor="Imagen" className="block text-sm font-medium leading-6 text-gray-900">
                            Imagen
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Imagen"
                                id="Imagen"
                                value={room.Imagen}
                                onChange={handleChange}
                                placeholder="Imagen"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="Nombre" className="block text-sm font-medium leading-6 text-gray-900">
                            Nombre
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Nombre"
                                id="Nombre"
                                value={room.Nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="Descripción" className="block text-sm font-medium leading-6 text-gray-900">
                            Descripción
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Descripción"
                                id="Descripción"
                                value={room.Descripción}
                                onChange={handleChange}
                                placeholder="Descripción"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Restricciones" className="block text-sm font-medium leading-6 text-gray-900">
                            Restricciones
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Restricciones"
                                id="Restricciones"
                                value={room.Restricciones}
                                onChange={handleChange}
                                placeholder="Restricciones"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Estado" className="block text-sm font-medium leading-6 text-gray-900">
                            Estado
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Estado"
                                id="Estado"
                                value={room.Estado}
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
                    onClick={() => onRoomUpdated()}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Actualizar
                </button>
            </div>
        </form>


    );
}

RoomFormEdit.propTypes = {
    selectedRoom: PropTypes.object,
    onRoomUpdated: PropTypes.func.isRequired,
};

export default RoomFormEdit;
