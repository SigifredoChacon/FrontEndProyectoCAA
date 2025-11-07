import React, { useState, useEffect } from "react";
import { useLogIn } from "../hooks/useLogIn.js";
import { useNavigate, Link } from "react-router-dom"; // Importar Link
import Swal from 'sweetalert2';

import RecoverPasswordModal from "../components/User/RecoverPasswordModal.jsx";
import BackButton from "../../utils/BackButton.jsx";

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { logIn, error, loading, isAuthenticated } = useLogIn();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        await logIn(email, password);
    };

    useEffect(() => {
        if (error) {
            setLocalError(error);
        } else if (!loading && isAuthenticated) {
            Swal.fire({
                title: '¡Inicio de sesión exitoso!',
                text: 'Serás redirigido a la página principal.',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    navigate('/');
                }
            });
        }
    }, [error, loading, isAuthenticated, navigate]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <BackButton/>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

                        <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-6 py-8 sm:px-8">
                            <h2 className="text-3xl font-extrabold text-white text-center">
                                Iniciar Sesión
                            </h2>
                            <p className="mt-2 text-center text-blue-100 text-sm">
                                Accede a tu cuenta
                            </p>
                        </div>


                        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                            <div className="space-y-6">

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Correo Electrónico <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (localError) setLocalError(null);
                                        }}
                                        placeholder="ejemplo@correo.com"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Contraseña <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (localError) setLocalError(null);
                                        }}
                                        placeholder="Ingresa tu contraseña"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleOpenModal}
                                        className="text-sm font-semibold text-pantone-blue hover:text-pantone-blue/80 transition"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </div>


                            {localError && (
                                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-700 font-medium">{localError}</p>
                                </div>
                            )}

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-pantone-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pantone-blue/90 transition"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-pantone-blue hover:text-pantone-blue/80 transition"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>

            <RecoverPasswordModal
                open={isModalOpen}
                handleClose={handleCloseModal}
            />
        </>
    );
}

export default LogIn;
