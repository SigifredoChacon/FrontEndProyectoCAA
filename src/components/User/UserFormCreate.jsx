import { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import { createUser } from '../../services/userService'; // Servicio para crear usuarios

// Define el estado inicial del usuario
const initialUserState = {
    CedulaCarnet: 0,
    Nombre: '',
    CorreoEmail: '',
    Contrasena: '',
    Telefono: '',
    Telefono2: '',
    Direccion: '',
    idRol: 0,
    CorreoInstitucional: ''
};

function UserFormCreate({ onUserCreated }) {
    const [user, setUser] = useState(initialUserState); // Estado para el formulario del usuario

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Maneja la creación de un nuevo usuario
    const handleCreateUser = async () => {
        try {
            await createUser(user); // Crea un nuevo usuario
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
                        <label htmlFor="CedulaCarnet" className="block text-sm font-medium leading-6 text-gray-900">
                            Cédula/Carnet
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="CedulaCarnet"
                                id="CedulaCarnet"
                                value={user.CedulaCarnet}
                                onChange={handleChange}
                                placeholder="Cédula/Carnet"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Nombre" className="block text-sm font-medium leading-6 text-gray-900">
                            Nombre
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Nombre"
                                id="Nombre"
                                value={user.Nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="CorreoEmail" className="block text-sm font-medium leading-6 text-gray-900">
                            Correo Personal
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="CorreoEmail"
                                id="CorreoEmail"
                                value={user.CorreoEmail}
                                onChange={handleChange}
                                placeholder="Correo Personal"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="CorreoInstitucional" className="block text-sm font-medium leading-6 text-gray-900">
                            Correo Institucional
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="CorreoInstitucional"
                                id="CorreoInstitucional"
                                value={user.CorreoInstitucional}
                                onChange={handleChange}
                                placeholder="Correo Institucional"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Contrasena" className="block text-sm font-medium leading-6 text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="Contrasena"
                                id="Contrasena"
                                value={user.Contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Telefono" className="block text-sm font-medium leading-6 text-gray-900">
                            Teléfono
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Telefono"
                                id="Telefono"
                                value={user.Telefono}
                                onChange={handleChange}
                                placeholder="Teléfono"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="Telefono2" className="block text-sm font-medium leading-6 text-gray-900">
                            Teléfono Alternativo
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Telefono2"
                                id="Telefono2"
                                value={user.Telefono2}
                                onChange={handleChange}
                                placeholder="Teléfono Alternativo"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="Direccion" className="block text-sm font-medium leading-6 text-gray-900">
                            Dirección
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="Direccion"
                                id="Direccion"
                                value={user.Direccion}
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
                            <input
                                type="number"
                                name="idRol"
                                id="idRol"
                                value={user.idRol}
                                onChange={handleChange}
                                placeholder="ID Rol"
                                required
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
                    onClick={() => setUser(initialUserState)}
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
