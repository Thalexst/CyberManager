import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001' // Asegúrate de que el puerto sea el correcto
});

// GET: Para leer listas
export const getItems = (endpoint) => api.get(`/${endpoint}`);

// POST: Para crear nuevos (Clientes, Sesiones)
export const createItem = (endpoint, item) => api.post(`/${endpoint}`, item);

// PUT: Para editar/actualizar (ESTA ES LA QUE ESTABA FALLANDO)
// Fíjate que al final tiene /${id} <--- ESTO ES LA CLAVE
export const updateItem = (endpoint, id, item) => api.put(`/${endpoint}/${id}`, item);

export default api;