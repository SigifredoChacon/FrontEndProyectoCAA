import api from '../../utils/api.js';

// Obtiene todas las categorías desde la API
// Salida: Retorna los datos de las categorías en un array
export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
}

// Obtiene una categoría específica por su nombre
// Entrada: nombre (string) - Nombre de la categoría a buscar
// Salida: Retorna los datos de la categoría encontrada
export const getByCategoriesName = async (nombre) => {
    const response = await api.get(`/categories/${nombre}`);
    return response.data;
}
