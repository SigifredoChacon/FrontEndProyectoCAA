import { useState } from 'react';

// Hook personalizado para manejar la edición de usuarios
export function useUserEdit() {
    const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado

    // Función para manejar la edición del usuario
    const handleEditUser = (user) => {
        setSelectedUser(user); // Establece el usuario seleccionado para editar
    };

    // Función para manejar cuando un usuario es creado o actualizado y se necesita actualizar la lista
    const handleUserUpdated = () => {
        setSelectedUser(null); // Limpia el usuario seleccionado después de actualizar o agregar
    };

    return {
        selectedUser,       // Estado del usuario seleccionado
        handleEditUser,     // Función para manejar la edición del usuario
        handleUserUpdated,  // Función para manejar la actualización del usuario
    };
}
