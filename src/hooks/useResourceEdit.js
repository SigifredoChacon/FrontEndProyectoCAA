import { useState } from 'react';

// Hook personalizado para manejar la edición de usuarios
export function useResourceEdit() {
    const [selectedResource, setSelectedResource] = useState(null); // Estado para la sala seleccionada

    // Función para manejar la edición de la sala
    const handleEditResource = (resource) => {
        setSelectedResource(resource); // Establece el usuario seleccionado para editar
    };

    // Función para manejar cuando una sala es creada o actualizada y se necesita actualizar la lista
    const handleResourceUpdated = () => {
        setSelectedResource(null); // Limpia el usuario seleccionado después de actualizar o agregar
    };

    return {
        selectedResource,       // Estado de la sala seleccionada
        handleEditResource,     // Función para manejar la edición de la sala
        handleResourceUpdated,  // Función para manejar la actualización de la sala
    };
}
