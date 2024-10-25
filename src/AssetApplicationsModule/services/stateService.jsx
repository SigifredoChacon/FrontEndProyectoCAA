import api from '../../utils/api.js';

// Obtiene todos los estados desde la API
// Salida: Retorna los datos de los estados en un array
export const getStates = async () => {
    const response = await api.get('/states');
    return response.data;
}

// Obtiene un estado específico por su nombre
// Entrada: nombre (string) - Nombre del estado a buscar
// Salida: Retorna los datos del estado encontrado
export const getByStateName = async (nombre) => {
    const response = await api.get(`/states/${nombre}`);
    return response.data;
}
