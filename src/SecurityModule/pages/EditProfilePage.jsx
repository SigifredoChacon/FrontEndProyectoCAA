import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../services/userService.jsx';
import {getRoles} from "../services/roleService.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {updateCubicle} from "../../ReservationModule/services/cubicleService.jsx";
import Swal from "sweetalert2";

function EditProfilePage() {
    const navigate = useNavigate();
    const Location = useLocation();
    const {userLog} = Location.state || {};
    const selectedUser = userLog;
    const [user, setUser] = useState(selectedUser);
    const [roles, setRoles] = useState([]);


    useEffect(() => {
        setUser(selectedUser);
    }, [selectedUser]);


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

            if (Object.keys(updatedFields).length > 0) {

                await updateUser(selectedUser.CedulaCarnet, updatedFields);
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha editado tu información',
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                })
                navigate('/profile');

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
        handleUpdateUser();

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Editar Usuario</h2>

                <div className="grid grid-cols-1 gap-y-6">

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

                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-pantone-red py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-pantone-red/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => navigate('/profile')}
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


export default EditProfilePage;