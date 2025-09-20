import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateRoom } from '../../services/roomService.jsx';
import Swal from "sweetalert2";


function RoomFormEdit({ selectedRoom, onRoomUpdated }) {
    const [room, setRoom] = useState(selectedRoom);

    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagen') {
            setRoom((prevRoom) => ({ ...prevRoom, Imagen: files[0] }));
        } else if (name === 'Estado') {
            setRoom((prevRoom) => ({ ...prevRoom, Estado: value === 'true' }));
        } else {
            setRoom((prevRoom) => ({ ...prevRoom, [name]: value }));
        }
    };

    const handleUpdateRoom = async () => {
        try {
            const roomToUpdate = convertFirstLetterToLowerCase(room);
            const initialRoomLowerCase = convertFirstLetterToLowerCase(selectedRoom);


            const updatedFields = Object.keys(roomToUpdate).reduce((acc, key) => {
                if (roomToUpdate[key] !== initialRoomLowerCase[key]) {
                    acc[key] = roomToUpdate[key];
                }
                return acc;
            }, {});

            const formData = new FormData();
            if (Object.keys(updatedFields).length > 0) {

                Object.keys(updatedFields).forEach(key => {
                    formData.append(key, updatedFields[key]);
                });


                if (room.Imagen) {
                    formData.append('Imagen', room.imagen);
                }

                await updateRoom(selectedRoom.idSala, formData);
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado la información de la sala con éxito',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    onRoomUpdated();
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
                text: 'Ya existe una sala con ese nombre',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateRoom();
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-2 border-pantone-blue">
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
                            accept="image/png, image/jpeg, image/jpg"
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
                            required
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
                            value={room.Estado ? 'true' : 'false'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="true">Activa</option>
                            <option value="false">Bloqueada</option>
                        </select>
                    </div>


                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-pantone-red py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-pantone-red/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => onRoomUpdated()}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-pantone-blue py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-pantone-blue/80 focus:outline-none focus:ring-2 focus:ring-[#004080] focus:ring-offset-2"
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
