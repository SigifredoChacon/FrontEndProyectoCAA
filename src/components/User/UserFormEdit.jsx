import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../../services/userService'; // Servicio para actualizar usuarios

function UserFormEdit({ selectedUser, onUserUpdated }) {
    const [user, setUser] = useState(selectedUser); // Estado inicial con el usuario seleccionado

    useEffect(() => {
        setUser(selectedUser); // Actualiza el estado si cambia el usuario seleccionado
    }, [selectedUser]);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Maneja la actualización del usuario
    const handleUpdateUser = async () => {
        try {
            await updateUser(user); // Actualiza el usuario
            onUserUpdated(); // Notifica al componente padre que el usuario ha sido actualizado
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateUser(); // Llama a la función de actualización
    };

    // Aquí está el return para UserFormEdit
    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Usuario</h2>

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

            <button type="submit">Actualizar</button>
        </form>
    );
}

UserFormEdit.propTypes = {
    selectedUser: PropTypes.object.isRequired, // El usuario seleccionado es requerido
    onUserUpdated: PropTypes.func.isRequired,
};

export default UserFormEdit;
