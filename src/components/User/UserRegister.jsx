import {useEffect, useState} from 'react';
import {createUser} from '../../services/userService';
import {getByRoleName} from "../../services/roleService.jsx";
import {useRegister} from "../../hooks/useRegister.js";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

const initialUserState = {
    cedulaCarnet: 0,
    nombre: '',
    correoEmail: '',
    contrasena: '',
    idRol: 0,
};

function UserRegister({role}) {
    const [user, setUser] = useState(initialUserState);
    const [userRole, setUserRole] = useState([]);
    const {register, loading, error, isRegister} = useRegister();
    const [localError, setLocalError] = useState(null);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (error) {
            setLocalError(error);
        } else if (!loading && isRegister && role === 'Estudiante') {
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    navigate('/login');
                }
            });
        }
        else if (!loading && isRegister && role === 'Profesor') {
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Para poder acceder a todas las funcionalidade de la plataforma, por favor, espera a que un administrador te apruebe , por el momento puedes reservar salas 🤗',
                icon: 'info',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',  // Texto del botón
            }).then((result) => {
                if (result.isConfirmed) {  // Verifica si el usuario presionó el botón de confirmación
                    navigate('/login');  // Redirige a la página de inicio de sesión
                }
            });
        }
    }, [error, loading, isRegister, navigate]);



    const fetchRoles = async () => {
        try {
            const data = await getByRoleName('Estudiante');
            setUserRole(data);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    }


    const handleCreateUser = async () => {
            const userToCreate = {
                ...user,
                cedulaCarnet: parseInt(user.cedulaCarnet, 10),
                idRol: parseInt(userRole.idRol, 10),
            };
            await register(userToCreate);


    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateUser();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center mb-6">Registrarse</h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label htmlFor="cedulaCarnet" className="block text-sm font-medium text-gray-700">
                            Cédula/Carnet
                        </label>
                        <input
                            type="number"
                            name="cedulaCarnet"
                            id="cedulaCarnet"
                            value={user.cedulaCarnet}
                            onChange={handleChange}
                            placeholder="Cédula/Carnet"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={user.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="correoEmail" className="block text-sm font-medium text-gray-700">
                            Correo Personal
                        </label>
                        <input
                            type="email"
                            name="correoEmail"
                            id="correoEmail"
                            value={user.correoEmail}
                            onChange={handleChange}
                            placeholder="Correo Personal"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="contrasena"
                            id="contrasena"
                            value={user.contrasena}
                            onChange={handleChange}
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
                        type="button"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                        onClick={() => {
                            setUser(initialUserState);
                            onUserCreated();
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>

    );
}



export default UserRegister;