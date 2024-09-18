import {useEffect, useState} from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import {createUser} from '../../services/userService';
import {getRoles} from "../../services/roleService.jsx"; // Servicio para crear usuarios

// Define el estado inicial del usuario
const initialUserState = {
    cedulaCarnet: 0,
    nombre: '',
    correoEmail: '',
    contrasena: '',
    telefono: '',
    telefono2: '',
    direccion: '',
    idRol: 0,
    correoInstitucional: ''
};

function UserFormCreate({onUserCreated}) {
    const [user, setUser] = useState(initialUserState); // Estado para el formulario del usuario
    const [roles, setRoles] = useState([]); // Estado para almacenar la lista de roles

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    useEffect(() => {
        fetchRoles(); // Llama a la función para obtener roles al montar el componente
    }, []);


    // Función para obtener la lista de roles desde el backend
    const fetchRoles = async () => {
        try {
            const data = await getRoles(); // Llama al servicio para obtener la lista de roles
            setRoles(data); // Actualiza el estado con los datos obtenidos
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    }

    // Maneja la creación de un nuevo usuario
    const handleCreateUser = async () => {
        try {

            const userToCreate = {
                ...user,
                cedulaCarnet: parseInt(user.cedulaCarnet, 10),
                idRol: parseInt(user.idRol, 10),
            };

            //console.log(userToCreate);
            await createUser(userToCreate); // Crea un nuevo usuario
            onUserCreated(); // Notifica al componente padre que el usuario ha sido creado
            setUser(initialUserState); // Limpia el formulario
        } catch (error) {
            console.error('Error al crear usuario:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateUser(); // Siempre llama a la función de creación
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Agregar Usuario</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="cedulaCarnet" className="block text-sm font-medium leading-6 text-gray-900">
                            Cédula/Carnet
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="cedulaCarnet"
                                id="cedulaCarnet"
                                value={user.cedulaCarnet}
                                onChange={handleChange}
                                placeholder="Cédula/Carnet"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="nombre" className="block text-sm font-medium leading-6 text-gray-900">
                            Nombre
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                value={user.nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="correoEmail" className="block text-sm font-medium leading-6 text-gray-900">
                            Correo Personal
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="correoEmail"
                                id="correoEmail"
                                value={user.correoEmail}
                                onChange={handleChange}
                                placeholder="Correo Personal"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="correoInstitucional"
                               className="block text-sm font-medium leading-6 text-gray-900">
                            orreo Institucional
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="correoInstitucional"
                                id="correoInstitucional"
                                value={user.correoInstitucional}
                                onChange={handleChange}
                                placeholder="Correo Institucional"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="contrasena" className="block text-sm font-medium leading-6 text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="contrasena"
                                id="contrasena"
                                value={user.contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="telefono" className="block text-sm font-medium leading-6 text-gray-900">
                            Teléfono
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="telefono"
                                id="telefono"
                                value={user.telefono}
                                onChange={handleChange}
                                placeholder="Teléfono"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="telefono2" className="block text-sm font-medium leading-6 text-gray-900">
                            Teléfono Alternativo
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="telefono2"
                                id="telefono2"
                                value={user.telefono2}
                                onChange={handleChange}
                                placeholder="Teléfono Alternativo"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="direccion" className="block text-sm font-medium leading-6 text-gray-900">
                            Dirección
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="direccion"
                                id="direccion"
                                value={user.direccion}
                                onChange={handleChange}
                                placeholder="Dirección"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="idRol" className="block text-sm font-medium leading-6 text-gray-900">
                            ID Rol
                        </label>
                        <div className="mt-2">
                            <select

                                name="idRol"
                                id="idRol"
                                value={user.idRol}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => {setUser(initialUserState); onUserCreated();} }
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
UserFormCreate.propTypes = {
    onUserCreated: PropTypes.func.isRequired, // Cambiado de onUserUpdated a onUserCreated
};

export default UserFormCreate;