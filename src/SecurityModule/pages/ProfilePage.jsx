import React, { useEffect, useState } from 'react';
import { useLogout } from "../hooks/useLogout.js";
import {Route, Routes, useNavigate} from "react-router-dom";
import { getUserById } from "../services/userService.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import EditProfilePage from "./EditProfilePage.jsx";
import Swal from "sweetalert2";
import ChangePasswordModal from "../components/User/ChangePasswordModal.jsx";
import BackButton from "../../utils/BackButton.jsx";

function ProfilePage() {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [userLog, setUserLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserById(user);
                setUserLog(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    if (!userLog) {
        return <div>Cargando...</div>;
    }


    const handleClick = async () => {
        logout();
        await Swal.fire({
            title: '¡Sesión cerrada!',
            text: 'Se ha cerrado la sesión con éxito',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            navigate('/', { replace: true });
            window.location.reload();
        });

    };

    const handleEditProfile = () => {
        navigate('/editProfile', { state: { userLog } });
    };

    const handleOpenModal = (reservation) => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };



    return (
        <>
        <BackButton/>
        <div className="min-h-screen bg-gray-40 flex items-center justify-center p-6 mt-6">
          <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-md relative flex flex-col border-2 border-pantone-blue">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-bold">Mi Perfil</h2>
                  <button
                      onClick={handleEditProfile}
                      className="p-2 rounded-lg hover:bg-gray-200"
                      title="Editar perfil"
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8 text-gray-700"
                      >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                      </svg>
                  </button>
              </div>

                {/* Información en secciones */}
                <div className="space-y-10 flex-1">

                    {/* Información personal */}
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 pb-2 border-b border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            Información Personal
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Nombre</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">{userLog.Nombre}</p>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Cédula/Carnet</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">{userLog.CedulaCarnet}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 pb-2 border-b border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            Información de Contacto
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">{userLog.CorreoEmail}</p>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Correo Institucional</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">
                                    {userLog?.CorreoInstitucional ? userLog.CorreoInstitucional : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Números de teléfono */}
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 pb-2 border-b border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                            Números de Teléfono
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Teléfono</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">
                                    {userLog?.Telefono ? userLog.Telefono : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Teléfono secundario</label>
                                <p className="mt-2 bg-gray-100 p-3 rounded text-lg">
                                    {userLog?.Telefono2 ? userLog.Telefono2 : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 pb-2 border-b border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            Dirección
                        </h2>
                        <div className="mt-4">
                            <label className="block text-lg font-medium text-gray-700">Dirección Completa</label>
                            <p className="mt-2 bg-gray-100 p-3 rounded text-lg">
                                {userLog?.Direccion ? userLog.Direccion : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>


            {/* Botón cambiar contraseña centrado abajo */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleOpenModal}
                className="py-3 px-6 bg-pantone-blue rounded-lg text-lg text-white hover:bg-pantone-blue/80"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>

          <ChangePasswordModal
            open={isModalOpen}
            handleClose={handleCloseModal}
            user={user}
          />
        </div>

        </>

    );
}

export default ProfilePage;
