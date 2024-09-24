import { useState, useEffect } from "react";
import { useLogIn } from "../hooks/useLogIn.js";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importar SweetAlert2

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { logIn, error, loading, isAuthenticated } = useLogIn();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    navigate('/');  // Navegar a la página de inicio después de la alerta
                }
            });
        }
    }, [error, loading, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Iniciar Sesión</h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Contraseña"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                {localError && (
                    <div className="mt-4 text-red-700 bg-red-100 border border-red-400 text-sm p-2 rounded">
                        {localError}
                    </div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Confirmar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LogIn;
