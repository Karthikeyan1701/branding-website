import api from './axios.js';

export const getCategories = () => {
    return api.get('/categories');
};

export const getCategoryById = (id) => {
    return api.get(`/categories/${id}`);
};

export const createCategory = (data) => {
    return api.post('/categories', data);
};

export const updateCategory = (id, data) => {
    return api.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
    return api.delete(`/categories/${id}`);
};