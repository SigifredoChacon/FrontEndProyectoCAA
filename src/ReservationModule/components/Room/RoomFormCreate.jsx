import {useState} from 'react';
import PropTypes from 'prop-types';
import {createRoom} from '../../services/roomService.jsx';
import Swal from "sweetalert2";

const initialRoomState = {
    imagen: null,
    nombre: '',
    descripcion: '',
    restricciones: '',
    estado: true,
};

function RoomFormCreate({onRoomCreated}) {
    const [room, setRoom] = useState(initialRoomState);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'imagen') {
            setRoom((prevRoom) => ({...prevRoom, imagen: files[0]}));
        } else {
            setRoom((prevRoom) => ({...prevRoom, [name]: value}));
        }
    };

    const handleCreateRoom = async () => {
        try {
            const formData = new FormData();
            formData.append('imagen', room.imagen);
            formData.append('nombre', room.nombre);
            formData.append('descripcion', room.descripcion);
            formData.append('restricciones', room.restricciones);
            formData.append('estado', room.estado);

            await createRoom(formData);
            setRoom(initialRoomState);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha creado la sala con éxito',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onRoomCreated();
            });
        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: 'Sala existente con ese nombre',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateRoom();
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
                            type="file"
                            name="imagen"
                            id="imagen"
                            onChange={handleChange}
                            required
                            accept="image/png, image/jpeg, image/jpg"
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
                            required
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
                            <option value="true">Activa</option>
                            <option value="false">Bloqueada</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => {
                            setRoom(initialRoomState);
                            onRoomCreated();
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

RoomFormCreate.propTypes = {
    onRoomCreated: PropTypes.func.isRequired,
};

export default RoomFormCreate;
