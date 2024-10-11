import React, { useEffect, useState } from 'react';
import { useLogout } from "../hooks/useLogout.js";
import {Route, Routes, useNavigate} from "react-router-dom";
import { getUserById } from "../services/userService.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import EditProfilePage from "./EditProfilePage.jsx";

function ProfilePage() {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [userLog, setUserLog] = useState(null);

    useEffect(() => {
        // Solo llama a la API si 'user' tiene un valor válido
        const fetchUserData = async () => {
            try {
                const data = await getUserById(user); // Llama a la API y espera la respuesta
                setUserLog(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user) { // Cambiado de userLog a user
            fetchUserData();
        }
    }, [user]); // Dependencia actualizada a `user`

    if (!userLog) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }


    const handleClick = () => {
        logout();
        navigate('/', { replace: true });
        window.location.reload();
    };

    const handleEditProfile = () => {
        navigate('/editProfile', { state: { userLog } }); // Pasar userLog en el estado de la navegación
    };




    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            <div className="flex flex-col lg:flex-row flex-1 p-6 space-y-6 lg:space-y-0 lg:space-x-6">

                {/* Profile Info Section */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog.Nombre}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cédula/Carnet</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog.CedulaCarnet}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog.CorreoEmail}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Institucional</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog?.CorreoInstitucional ? userLog.CorreoInstitucional : "N/A"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog.Telefono}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono 2</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog?.Telefono2 ? userLog.Telefono2 : "N/A"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <p className="mt-1 bg-gray-200 p-2 rounded">{userLog?.Direccion ? userLog.Direccion : "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Actions and Image Section */}
                <div className="lg:w-1/3 bg-white rounded-lg shadow-md flex flex-col p-6">
                    {/* Centered Title */}
                    <h2 className="text-2xl font-semibold mb-6 text-center">Opciones</h2>

                    {/* Buttons and Image centered */}
                    <div className="flex flex-col items-center space-y-4 mt-4">
                        <button className="w-full py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">Cambiar contraseña</button>
                        <button onClick={handleEditProfile} className="w-full py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">Editar perfil</button>
                        <button onClick={handleClick} className="w-full py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">Cerrar sesión</button>

                        {/* Image with blur and margin */}
                        <div className="w-full flex justify-center mt-20">
                            <img
                                src="/src/assets/perfil.jpg"
                                alt="Illustration"
                                className="w-full max-w-md h-auto mt-10"
                            />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default ProfilePage;
