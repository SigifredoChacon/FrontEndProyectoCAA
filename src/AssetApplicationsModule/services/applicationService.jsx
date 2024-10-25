import api from '../../utils/api.js';

// Obtiene todas las aplicaciones de la API
// Salida: Retorna los datos de las aplicaciones en un array
export const getApplication = async () => {
    const response = await api.get('/applications');
    return response.data;
};

// Obtiene aplicaciones de un usuario específico por ID
// Entrada: id (número) - ID del usuario
// Salida: Retorna los datos de las aplicaciones del usuario especificado en un array
export const getApplicationByUserId = async (id) => {
    const response = await api.get(`/applications/getbyUserId/${id}`);
    return response.data;
}

// Crea una nueva aplicación con datos de solicitud en formato multipart
// Entrada: request (objeto FormData) - Datos de la solicitud de aplicación
// Salida: Retorna el objeto de respuesta completo
export const createApplication = async (request) => {
    const response = await api.post('/applications', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

// Actualiza una aplicación existente mediante ID y datos de solicitud
// Entrada:
//   - id (número) - ID de la aplicación a actualizar
//   - request (objeto) - Datos de la actualización
// Salida: Retorna los datos de la aplicación actualizada
export const updateApplication = async (id, request) => {
    const response = await api.patch(`/applications/${id}`, request);
    return response.data;
};

// Elimina una aplicación específica por ID
// Entrada: id (número) - ID de la aplicación a eliminar
// Salida: Retorna los datos de la aplicación eliminada
export const deleteApplication = async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
};

// Obtiene los detalles de una aplicación específica por ID
// Entrada: id (número) - ID de la aplicación
// Salida: Retorna los datos de la aplicación solicitada
export const getApplicationById = async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
};

// Envía una justificación de rechazo para una solicitud específica
// Entrada:
//   - idSolicitud (número) - ID de la solicitud
//   - idUsuario (número) - ID del usuario solicitante
//   - justificacion (string) - Razón de la justificación de rechazo
// Salida: Retorna los datos de confirmación de envío de justificación
export const sendJustification = async (idSolicitud, idUsuario, justificacion) => {
    const response = await api.post('/applications/sendJustification', {
        idSolicitud,
        idUsuario,
        justificacion
    });
    return response.data;
};

// Actualiza una solicitud con un archivo firmado
// Entrada:
//   - id (número) - ID de la solicitud a actualizar
//   - formData (objeto FormData) - Datos incluyendo el archivo firmado
// Salida: Retorna los datos de la solicitud actualizada
export const updateApplicationWithFile = async (id, formData) => {
    const response = await api.patch(`/applications/updateSignApplication/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
