import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {createUser} from '../../services/userService.jsx';
import {getRoles} from "../../services/roleService.jsx";
import Swal from "sweetalert2";

const initialUserState = {
    cedulaCarnet: 0,
    nombre: '',
    correoEmail: '',
    contrasena: '',
    telefono: '',
    telefono2: '',
    direccion: '',
    estado: 0,
    idRol: 0,
    correoInstitucional: ''
};

function UserExternalFormCreate({onUserCreated, onCancel}) {
    const [user, setUser] = useState(initialUserState);
    const [roles, setRoles] = useState([]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    useEffect(() => {
        fetchRoles();
    }, []);



    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
            user.idRol = data.find(rol => rol.nombre === 'Externo')?.idRol || 0;
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    }


    const handleCreateUser = async () => {
        try {

            const userToCreate = {
                ...user,
                estado: parseInt(user.estado, 10),
                cedulaCarnet: parseInt(user.cedulaCarnet, 10),
                idRol: parseInt(user.idRol, 10),
            };


            await createUser(userToCreate);
            setUser(initialUserState);
            onUserCreated(user.cedulaCarnet);
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Se ha registrado el usuario externo exitosamente',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            });

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
        handleCreateUser();
    };

    return (

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900 text-center mb-6">
                    Agregar Usuario Externo
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                            min={10000000}
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
                        <label htmlFor="correoInstitucional" className="block text-sm font-medium text-gray-700">
                            Correo Institucional
                        </label>
                        <input
                            type="email"
                            name="correoInstitucional"
                            id="correoInstitucional"
                            value={user.correoInstitucional}
                            onChange={handleChange}
                            placeholder="Correo Institucional"
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

                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            type="number"
                            name="telefono"
                            id="telefono"
                            value={user.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono2" className="block text-sm font-medium text-gray-700">
                            Teléfono Alternativo
                        </label>
                        <input
                            type="number"
                            name="telefono2"
                            id="telefono2"
                            value={user.telefono2}
                            onChange={handleChange}
                            placeholder="Teléfono Alternativo"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            value={user.direccion}
                            onChange={handleChange}
                            placeholder="Dirección"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="idRol" className="block text-sm font-medium text-gray-700">
                            Rol
                        </label>
                        <input
                            type="text"
                            name="rol"
                            id="rol"
                            value={roles.find(rol => rol.idRol === user.idRol)?.nombre || 'Rol no encontrado'}
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm bg-gray-100 sm:text-sm"
                        />
                        <input type="hidden" name="idRol" value={user.idRol}/>
                    </div>
                </div>

                <div className="col-span-2 mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-pantone-red py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-pantone-red/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => {
                            setUser(initialUserState);
                            onCancel();
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        style={{backgroundColor: '#002855'}}
                        className="inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Agregar
                    </button>
                </div>
            </form>


    );
}


UserExternalFormCreate.propTypes = {
    onUserCreated: PropTypes.func.isRequired,
};

export default UserExternalFormCreate;