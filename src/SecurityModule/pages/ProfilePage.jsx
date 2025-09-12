import React, { useEffect, useState } from 'react';
import { useLogout } from "../hooks/useLogout.js";
import {Route, Routes, useNavigate} from "react-router-dom";
import { getUserById } from "../services/userService.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import EditProfilePage from "./EditProfilePage.jsx";
import Swal from "sweetalert2";
import ChangePasswordModal from "../components/User/ChangePasswordModal.jsx";

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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-md relative flex flex-col">
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

            {/* Datos en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div>
                <label className="block text-lg font-medium text-gray-700">Nombre</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">{userLog.Nombre}</p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Cédula/Carnet</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">{userLog.CedulaCarnet}</p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">{userLog.CorreoEmail}</p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Correo Institucional</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">
                  {userLog?.CorreoInstitucional ? userLog.CorreoInstitucional : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Teléfono</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">
                  {userLog?.Telefono ? userLog.Telefono : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Teléfono 2</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">
                  {userLog?.Telefono2 ? userLog.Telefono2 : "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700">Dirección</label>
                <p className="mt-2 bg-gray-200 p-3 rounded text-lg">
                  {userLog?.Direccion ? userLog.Direccion : "N/A"}
                </p>
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



    );
}

export default ProfilePage;
