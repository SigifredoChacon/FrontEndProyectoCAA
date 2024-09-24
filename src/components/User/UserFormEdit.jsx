import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../../services/userService';
import {getRoles} from "../../services/roleService.jsx";

function UserFormEdit({ selectedUser, onUserUpdated}) {
    const [user, setUser] = useState(selectedUser);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        setUser(selectedUser);
        fetchRoles();
    }, [selectedUser]);


    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    }
    const convertFirstLetterToLowerCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleUpdateUser = async () => {
        try {
            const userToUpdate = convertFirstLetterToLowerCase(user);
            const initialUserLowerCase = convertFirstLetterToLowerCase(selectedUser);


            const updatedFields = Object.keys(userToUpdate).reduce((acc, key) => {
                if (userToUpdate[key] !== initialUserLowerCase[key]) {
                    acc[key] = userToUpdate[key];
                }
                return acc;
            }, {});
            if (updatedFields.idRol) {
                updatedFields.idRol = parseInt(updatedFields.idRol, 10);
            }

            if (Object.keys(updatedFields).length > 0) {
                console.log('Updating user with data:', updatedFields);
                console.log('User to update:', userToUpdate.CedulaCarnet);
                await updateUser(selectedUser.CedulaCarnet, updatedFields);
                onUserUpdated();

            } else {
                console.log('No changes detected, update not required.');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateUser();
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Usuario</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="CedulaCarnet" className="block text-sm font-medium text-gray-700">
                            Cédula/Carnet
                        </label>
                        <input
                            type="text"
                            name="CedulaCarnet"
                            id="CedulaCarnet"
                            value={user.CedulaCarnet}
                            onChange={handleChange}
                            placeholder="Cédula/Carnet"
                            required
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
                            value={user.Nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="CorreoEmail" className="block text-sm font-medium text-gray-700">
                            Correo Personal
                        </label>
                        <input
                            type="email"
                            name="CorreoEmail"
                            id="CorreoEmail"
                            value={user.CorreoEmail}
                            onChange={handleChange}
                            placeholder="Correo Personal"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="CorreoInstitucional" className="block text-sm font-medium text-gray-700">
                            Correo Institucional
                        </label>
                        <input
                            type="email"
                            name="CorreoInstitucional"
                            id="CorreoInstitucional"
                            value={user.CorreoInstitucional}
                            onChange={handleChange}
                            placeholder="Correo Institucional"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Contrasena" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="Contrasena"
                            id="Contrasena"
                            value={user.Contrasena}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Telefono" className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            name="Telefono"
                            id="Telefono"
                            value={user.Telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Telefono2" className="block text-sm font-medium text-gray-700">
                            Teléfono Alternativo
                        </label>
                        <input
                            type="text"
                            name="Telefono2"
                            id="Telefono2"
                            value={user.Telefono2}
                            onChange={handleChange}
                            placeholder="Teléfono Alternativo"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="Direccion" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="Direccion"
                            id="Direccion"
                            value={user.Direccion}
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
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => onUserUpdated()}
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

UserFormEdit.propTypes = {
    selectedUser: PropTypes.object,
    onUserUpdated: PropTypes.func.isRequired,
};

export default UserFormEdit;
