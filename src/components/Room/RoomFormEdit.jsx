import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateRoom } from '../../services/roomService.jsx';


function RoomFormEdit({ selectedRoom, onRoomUpdated }) {
    const [room, setRoom] = useState(selectedRoom);

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    console.log(room.Nombre);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagen') {
            setRoom((prevRoom) => ({ ...prevRoom, Imagen: files[0] })); // Almacena el archivo
        }
        else {
            setRoom((prevRoom) => ({ ...prevRoom, [name]: value }));
        }
    };

    const handleUpdateRoom = async () => {
        try {
            const roomToUpdate = convertFirstLetterToLowerCase(room);
            const initialRoomLowerCase = convertFirstLetterToLowerCase(selectedRoom);

            // Filtra solo los campos que han cambiado
            const updatedFields = Object.keys(roomToUpdate).reduce((acc, key) => {
                if (roomToUpdate[key] !== initialRoomLowerCase[key]) {
                    acc[key] = roomToUpdate[key];
                }
                return acc;
            }, {});

            const formData = new FormData();
            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating room with data:', updatedFields);

                // Agrega solo los campos que han cambiado al FormData
                Object.keys(updatedFields).forEach(key => {
                    formData.append(key, updatedFields[key]);
                });

                // Si hay una imagen seleccionada, agregarla al FormData
                if (room.Imagen) {
                    formData.append('Imagen', room.imagen);
                }

                console.log('Room to update:', roomToUpdate.idSala);
                await updateRoom(selectedRoom.idSala, formData); // Enviar FormData
                onRoomUpdated(); // Notifica al componente padre que la sala ha sido actualizada
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Sala</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="Imagen" className="block text-sm font-medium text-gray-700">
                            Imagen
                        </label>
                        <input
                            type="file"
                            name="imagen"
                            id="imagen"
                            onChange={handleChange}
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
                            value={room.Nombre}
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
                            value={room.Descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Restricciones" className="block text-sm font-medium text-gray-700">
                            Restricciones
                        </label>
                        <input
                            type="text"
                            name="Restricciones"
                            id="Restricciones"
                            value={room.Restricciones}
                            onChange={handleChange}
                            placeholder="Restricciones"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Estado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="Estado"
                            id="Estado"
                            value={room.Estado ? '1' : '0'} // Mostrar como '1' o '0' en el select
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
                        onClick={() => onRoomUpdated()}
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

RoomFormEdit.propTypes = {
    selectedRoom: PropTypes.object,
    onRoomUpdated: PropTypes.func.isRequired,
};

export default RoomFormEdit;
