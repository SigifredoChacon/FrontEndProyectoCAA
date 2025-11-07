import React, {useEffect, useState} from 'react';
import {sendAdminEmails} from '../../services/userService.jsx';
import {getByRoleName} from "../../services/roleService.jsx";
import {useRegister} from "../../hooks/useRegister.js";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import BackButton from "../../../utils/BackButton.jsx";

const initialUserState = {
    cedulaCarnet: 0,
    nombre: '',
    correoEmail: '',
    contrasena: '',
    estado: false,
    idRol: 0,
};

function UserRegister({role}) {
    const [user, setUser] = useState(initialUserState);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userRole, setUserRole] = useState([]);
    const {register, loading, error, isRegister} = useRegister();
    const [localError, setLocalError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const navigate = useNavigate();

    // Estado para los requerimientos de contraseña
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    // Función para validar la contraseña
    const validatePassword = (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        setPasswordRequirements(requirements);
        return Object.values(requirements).every(req => req === true);
    };

    const handleChange = (e) => {
        setLocalError(null);
        setPasswordError('');
        const {name, value} = e.target;

        if (name === 'contrasena') {
            validatePassword(value);
        }

        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    const handleConfirmPasswordChange = (e) => {
        setPasswordError('');
        setConfirmPassword(e.target.value);
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
                text: 'Para poder acceder a todas las funcionalidades de la plataforma, por favor, espera a que un administrador te apruebe , por el momento puedes reservar salas 🤗',
                icon: 'info',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    sendAdminEmails(user.cedulaCarnet, user.nombre, user.correoEmail);
                    navigate('/login');
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
        setLocalError(null);
        setPasswordError('');

        // Validar que las contraseñas coincidan
        if (user.contrasena !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        // Validar que la contraseña cumpla todos los requerimientos
        if (!validatePassword(user.contrasena)) {
            setPasswordError('La contraseña no cumple con todos los requisitos de seguridad');
            return;
        }

        handleCreateUser();
    };

    // Componente para mostrar un requerimiento
    const RequirementItem = ({ met, text }) => (
        <div className="flex items-center gap-2">
            {met ? (
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            <span className={`text-sm ${met ? 'text-green-700 font-medium' : 'text-slate-600'}`}>
                {text}
            </span>
        </div>
    );

    return (
        <>
            <BackButton/>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl">

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

                        <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-6 py-8 sm:px-8">
                            <h2 className="text-3xl font-extrabold text-white text-center">
                                Crear Cuenta
                            </h2>
                            <p className="mt-2 text-center text-blue-100 text-sm">
                                Completa el formulario para registrarte
                            </p>
                        </div>


                        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                            <div className="space-y-6">

                                <div>
                                    <label htmlFor="cedulaCarnet" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Cédula/Carnet <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="cedulaCarnet"
                                        id="cedulaCarnet"
                                        value={user.cedulaCarnet || ''}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu cédula o carnet"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Nombre Completo <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={user.nombre}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu nombre completo"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div>
                                    <label htmlFor="correoEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Correo Electrónico <span className="text-pantone-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="correoEmail"
                                        id="correoEmail"
                                        value={user.correoEmail}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                    />
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label htmlFor="contrasena" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Contraseña <span className="text-pantone-red">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="contrasena"
                                            id="contrasena"
                                            value={user.contrasena}
                                            onChange={handleChange}
                                            onFocus={() => setShowPasswordRequirements(true)}
                                            placeholder="Crea una contraseña segura"
                                            required
                                            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Confirmar Contraseña <span className="text-pantone-red">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            placeholder="Repite tu contraseña"
                                            required
                                            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/20 transition"
                                        />
                                    </div>
                                </div>

                                {showPasswordRequirements && (
                                    <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-4">
                                        <p className="text-sm font-semibold text-slate-700 mb-3">
                                            Requisitos de la contraseña:
                                        </p>
                                        <div className="space-y-2">
                                            <RequirementItem
                                                met={passwordRequirements.minLength}
                                                text="Al menos 8 caracteres"
                                            />
                                            <RequirementItem
                                                met={passwordRequirements.hasUpperCase}
                                                text="Al menos una letra mayúscula (A-Z)"
                                            />
                                            <RequirementItem
                                                met={passwordRequirements.hasLowerCase}
                                                text="Al menos una letra minúscula (a-z)"
                                            />
                                            <RequirementItem
                                                met={passwordRequirements.hasNumber}
                                                text="Al menos un número (0-9)"
                                            />
                                            <RequirementItem
                                                met={passwordRequirements.hasSpecialChar}
                                                text="Al menos un carácter especial (!@#$%^&*)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>


                            {passwordError && (
                                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-700 font-medium">{passwordError}</p>
                                </div>
                            )}

                            {localError && (
                                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-700 font-medium">{localError}</p>
                                </div>
                            )}

                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUser(initialUserState);
                                        setConfirmPassword('');
                                        setShowPasswordRequirements(false);
                                        navigate('/register');
                                    }}
                                    className="w-full sm:w-auto rounded-lg border-2 border-slate-300 bg-pantone-red text-white px-6 py-3 text-sm font-semibold hover:bg-pantone-red/90 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto rounded-lg bg-pantone-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pantone-blue/90 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </div>
                        </form>
                    </div>


                    <p className="mt-6 text-center text-sm text-slate-600">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="font-semibold text-pantone-blue hover:text-pantone-blue/80 transition"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}

export default UserRegister;