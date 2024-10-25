import api from '../../utils/api.js';

// Obtiene todos los activos desde la API
// Salida: Retorna los datos de los activos en un array
export const getAssets = async () => {
    const response = await api.get('/assets');
    return response.data;
};

// Crea un nuevo activo en la base de datos
// Entrada: asset (objeto) - Datos del activo a crear
// Salida: Retorna el objeto de respuesta completo de la solicitud de creación
export const createAsset = async (asset) => {
    const response = await api.post('/assets', asset);
    return response;
};

// Actualiza un activo existente mediante su ID
// Entrada:
//   - id (número) - ID del activo a actualizar
//   - asset (objeto) - Datos actualizados del activo
// Salida: Retorna los datos del activo actualizado
export const updateAsset = async (id, asset) => {
    const response = await api.patch(`/assets/${id}`, asset);
    return response.data;
};

// Elimina un activo específico de la base de datos mediante su ID
// Entrada: id (número) - ID del activo a eliminar
// Salida: Retorna el objeto de respuesta completo de la solicitud de eliminación
export const deleteAsset = async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response;
};

// Obtiene los detalles de un activo específico por ID
// Entrada: id (número) - ID del activo a buscar
// Salida: Retorna los datos del activo encontrado
export const getAssetById = async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
};

// Obtiene el primer activo disponible en una categoría específica
// Entrada: assetCategory (string) - Nombre de la categoría del activo
// Salida: Retorna los datos del primer activo disponible en la categoría especificada
export const getFirstAvailableAsset = async (assetCategory) => {
    const response = await api.get(`/assets/available/${assetCategory}`);
    return response.data;
};
