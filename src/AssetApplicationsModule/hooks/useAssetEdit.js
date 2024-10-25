import { useState } from 'react';

// Hook personalizado para manejar la edición de activos en el sistema
// Salida:
// - selectedAsset: Objeto del activo seleccionado para editar, inicializado en null
// - handleEditAsset: Función para seleccionar un activo y establecerlo como activo en edición
// - handleAssetUpdated: Función para restablecer el activo seleccionado a null después de actualizarlo
export function useAssetEdit() {
    const [selectedAsset, setSelectedAsset] = useState(null); // Estado que mantiene el activo seleccionado para edición

    // Función para seleccionar un activo a editar
    // Entrada:
    // - asset: Objeto que representa el activo seleccionado
    // Salida: Actualiza el estado selectedAsset con el activo proporcionado
    const handleEditAsset = (asset) => {
        setSelectedAsset(asset);
    };

    // Función para indicar que el activo ha sido actualizado y restablecer el estado
    // Entrada: Ninguna
    // Salida: Restablece selectedAsset a null
    const handleAssetUpdated = () => {
        setSelectedAsset(null);
    };

    // Retorna el estado y las funciones manejadoras para editar activos
    return {
        selectedAsset,
        handleEditAsset,
        handleAssetUpdated,
    };
}
