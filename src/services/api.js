import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'
});

export const getItems = (endpoint) => api.get(`/${endpoint}`);
export const createItem = (endpoint, item) => api.post(`/${endpoint}`, item);
export const updateItem = (endpoint, id, item) => api.put(`/${endpoint}/${id}`, item);
export const deleteItem = (endpoint, id) => api.delete(`/${endpoint}/${id}`);

export default api;