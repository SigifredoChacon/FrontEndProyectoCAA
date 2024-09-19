import { useState } from 'react';

// Hook personalizado para manejar la edición de usuarios
export function useCubicleEdit() {
    const [selectedCubicle, setSelectedCubicle] = useState(null); // Estado para la sala seleccionada

    // Función para manejar la edición de la sala
    const handleEditCubicle = (cubicle) => {
        setSelectedCubicle(cubicle); // Establece el usuario seleccionado para editar
    };

    // Función para manejar cuando una sala es creada o actualizada y se necesita actualizar la lista
    const handleCubicleUpdated = () => {
        setSelectedCubicle(null); // Limpia el usuario seleccionado después de actualizar o agregar
    };

    return {
        selectedCubicle,       // Estado de la sala seleccionada
        handleEditCubicle,     // Función para manejar la edición de la sala
        handleCubicleUpdated,  // Función para manejar la actualización de la sala
    };
}
