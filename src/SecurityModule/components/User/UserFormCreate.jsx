import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {createUser} from '../../services/userService.jsx';
import {getRoles} from "../../services/roleService.jsx";
import Swal from "sweetalert2";

const initialUserState = {
    cedulaCarnet: 0,
    nombre: '',
    correoEmail: '',
    contrasena: '',
    telefono: '',
    telefono2: '',
    direccion: '',
    estado:0,
    idRol: 0,
    correoInstitucional: ''
};

function UserFormCreate({onUserCreated}) {
    const [user, setUser] = useState(initialUserState);
    const [roles, setRoles] = useState([]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    useEffect(() => {
        fetchRoles();
    }, []);



    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    }


    const handleCreateUser = async () => {
        try {

            const userToCreate = {
                ...user,
                estado: parseInt(user.estado, 10),
                cedulaCarnet: parseInt(user.cedulaCarnet, 10),
                idRol: parseInt(user.idRol, 10),
            };


            await createUser(userToCreate);
            setUser(initialUserState);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha creado el usuario con éxito',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onUserCreated();
            });

        } catch (error) {
            await Swal.fire({
                title: '¡Error!',
                text: error.response.data.message,
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateUser();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Agregar Usuario</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="cedulaCarnet" className="block text-sm font-medium text-gray-700">
                            Cédula/Carnet
                        </label>
                        <input
                            type="number"
                            name="cedulaCarnet"
                            id="cedulaCarnet"
                            value={user.cedulaCarnet}
                            onChange={handleChange}
                            placeholder="Cédula/Carnet"
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
                            value={user.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="correoEmail" className="block text-sm font-medium text-gray-700">
                            Correo Personal
                        </label>
                        <input
                            type="email"
                            name="correoEmail"
                            id="correoEmail"
                            value={user.correoEmail}
                            onChange={handleChange}
                            placeholder="Correo Personal"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="correoInstitucional" className="block text-sm font-medium text-gray-700">
                            Correo Institucional
                        </label>
                        <input
                            type="email"
                            name="correoInstitucional"
                            id="correoInstitucional"
                            value={user.correoInstitucional}
                            onChange={handleChange}
                            placeholder="Correo Institucional"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="contrasena"
                            id="contrasena"
                            value={user.contrasena}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            type="number"
                            name="telefono"
                            id="telefono"
                            value={user.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono2" className="block text-sm font-medium text-gray-700">
                            Teléfono Alternativo
                        </label>
                        <input
                            type="number"
                            name="telefono2"
                            id="telefono2"
                            value={user.telefono2}
                            onChange={handleChange}
                            placeholder="Teléfono Alternativo"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            value={user.direccion}
                            onChange={handleChange}
                            placeholder="Dirección"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="idRol" className="block text-sm font-medium text-gray-700">
                            ID Rol
                        </label>
                        <select
                            name="idRol"
                            id="idRol"
                            value={user.idRol}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccione un Rol</option>
                            {roles.map((rol) => (
                                <option key={rol.idRol} value={rol.idRol}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => {
                            setUser(initialUserState);
                            onUserCreated();
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


UserFormCreate.propTypes = {
    onUserCreated: PropTypes.func.isRequired,
};

export default UserFormCreate;