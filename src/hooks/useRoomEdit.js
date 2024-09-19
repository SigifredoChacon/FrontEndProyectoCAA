import { useState } from 'react';

// Hook personalizado para manejar la edición de usuarios
export function useRoomEdit() {
    const [selectedRoom, setSelectedRoom] = useState(null); // Estado para la sala seleccionada

    // Función para manejar la edición de la sala
    const handleEditRoom = (room) => {
        setSelectedRoom(room); // Establece el usuario seleccionado para editar
    };

    // Función para manejar cuando una sala es creada o actualizada y se necesita actualizar la lista
    const handleRoomUpdated = () => {
        setSelectedRoom(null); // Limpia el usuario seleccionado después de actualizar o agregar
    };

    return {
        selectedRoom,       // Estado de la sala seleccionada
        handleEditRoom,     // Función para manejar la edición de la sala
        handleRoomUpdated,  // Función para manejar la actualización de la sala
    };
}
