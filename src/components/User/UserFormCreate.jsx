import { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import { createUser } from '../../services/userService'; // Servicio para crear usuarios

// Define el estado inicial del usuario
const initialUserState = {
    CedulaCarnet: 0,
    Nombre: '',
    CorreoEmail: '',
    Contrasena: '',
    Telefono: '',
    Telefono2: '',
    Direccion: '',
    idRol: 0,
    CorreoInstitucional: ''
};

function UserFormCreate({ onUserCreated }) {
    const [user, setUser] = useState(initialUserState); // Estado para el formulario del usuario

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Maneja la creación de un nuevo usuario
    const handleCreateUser = async () => {
        try {
            await createUser(user); // Crea un nuevo usuario
            onUserCreated(); // Notifica al componente padre que el usuario ha sido creado
            setUser(initialUserState); // Limpia el formulario
        } catch (error) {
            console.error('Error al crear usuario:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateUser(); // Siempre llama a la función de creación
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Agregar Usuario</h2>

            <input
                type="text"
                name="CedulaCarnet"
                value={user.CedulaCarnet}
                onChange={handleChange}
                placeholder="Cédula/Carnet"
                required
            />

            <input
                type="text"
                name="Nombre"
                value={user.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
            />

            <input
                type="email"
                name="CorreoEmail"
                value={user.CorreoEmail}
                onChange={handleChange}
                placeholder="Correo Personal"
                required
            />

            <input
                type="email"
                name="CorreoInstitucional"
                value={user.CorreoInstitucional}
                onChange={handleChange}
                placeholder="Correo Institucional"
            />

            <input
                type="password"
                name="Contrasena"
                value={user.Contrasena}
                onChange={handleChange}
                placeholder="Contraseña"
                required
            />

            <input
                type="text"
                name="Telefono"
                value={user.Telefono}
                onChange={handleChange}
                placeholder="Teléfono"
            />

            <input
                type="text"
                name="Telefono2"
                value={user.Telefono2}
                onChange={handleChange}
                placeholder="Teléfono Alternativo"
            />

            <input
                type="text"
                name="Direccion"
                value={user.Direccion}
                onChange={handleChange}
                placeholder="Dirección"
            />

            <input
                type="number"
                name="idRol"
                value={user.idRol}
                onChange={handleChange}
                placeholder="ID Rol"
                required
            />

            <button type="submit">Agregar</button>
        </form>
    );
}

// Validación de PropTypes para el componente
UserFormCreate.propTypes = {
    onUserCreated: PropTypes.func.isRequired, // Cambiado de onUserUpdated a onUserCreated
};

export default UserFormCreate;
