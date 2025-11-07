import { useState, useEffect } from 'react';
import { updateUser } from '../services/userService.jsx';
import {useLocation, useNavigate} from "react-router-dom";
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

                    <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-6 py-8 sm:px-8">
                        <h2 className="text-3xl font-extrabold text-white text-center">
                            Editar Perfil
                        </h2>
                        <p className="mt-2 text-center text-blue-100 text-sm">
                            Actualiza tu información personal
                        </p>
                    </div>


                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                        <div className="space-y-6">

                            <div>
                                <label htmlFor="Nombre" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nombre Completo <span className="text-pantone-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="Nombre"
                                    id="Nombre"
                                    value={user.Nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre completo"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label htmlFor="CorreoEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Correo Personal <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="CorreoEmail"
                                        id="CorreoEmail"
                                        value={user.CorreoEmail}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div>
                                    <label htmlFor="CorreoInstitucional" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Correo Institucional
                                    </label>
                                    <input
                                        type="email"
                                        name="CorreoInstitucional"
                                        id="CorreoInstitucional"
                                        value={user.CorreoInstitucional}
                                        onChange={handleChange}
                                        placeholder="ejemplo@institucion.edu"
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label htmlFor="Telefono" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Teléfono Principal
                                    </label>
                                    <input
                                        type="tel"
                                        name="Telefono"
                                        id="Telefono"
                                        value={user.Telefono}
                                        onChange={handleChange}
                                        placeholder="1234-5678"
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div>
                                    <label htmlFor="Telefono2" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Teléfono Alternativo
                                    </label>
                                    <input
                                        type="tel"
                                        name="Telefono2"
                                        id="Telefono2"
                                        value={user.Telefono2}
                                        onChange={handleChange}
                                        placeholder="8765-4321"
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>
                            </div>


                            <div>
                                <label htmlFor="Direccion" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Dirección
                                </label>
                                <textarea
                                    name="Direccion"
                                    id="Direccion"
                                    value={user.Direccion}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu dirección completa"
                                    rows="3"
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition resize-none"
                                />
                            </div>

                            <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-blue-700">
                                    Los campos marcados con <span className="text-pantone-red font-semibold">*</span> son obligatorios. La información adicional nos ayuda a brindarte un mejor servicio.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="w-full sm:w-auto rounded-lg border-2 border-pantone-red bg-pantone-red text-white px-6 py-3 text-sm font-semibold hover:bg-pantone-red/90 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto rounded-lg bg-pantone-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pantone-blue/90 transition"
                            >
                                Actualizar Perfil
                            </button>
                        </div>
                    </form>
                </div>


            </div>
        </div>


    );
}


export default EditProfilePage;