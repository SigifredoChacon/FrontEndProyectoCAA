import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../../services/userService.jsx';
import {getRoles} from "../../services/roleService.jsx";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

function UserFormEdit({ selectedUser, onUserUpdated}) {
    const [user, setUser] = useState(selectedUser);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

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
        if (name === 'Estado') {
            setUser((prevUser) => ({
                ...prevUser,
                [name]: value === 'true' ? true : false
            }));
        }
        else {
            setUser((prevUser) => ({ ...prevUser, [name]: value }));
        }
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

                await updateUser(selectedUser.CedulaCarnet, updatedFields);
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado la información del usuario con éxito',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    onUserUpdated();
                });


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
        <div className="min-h-screen flex items-center justify-center">
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
                            disabled
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
                            disabled
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
                            value={user.Estado ? 'true' : 'false'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="false">Activo</option>
                            <option value="true">Bloqueado</option>
                        </select>
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
                        onClick={() => onUserUpdated()}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#004080] py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-[#004080] focus:ring-offset-2"
                    >
                        Actualizar
                    </button>
                </div>
            </form>
        </div>


    );
}


export default UserFormEdit;
