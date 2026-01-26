import api from './axios.js';

export const getSubcategories = () => {
    return api.get('/subcategories');
};

export const getSubcategoriesByCategory = (categoryId) => {
    return api.get(`/subcategories/category/${categoryId}`);
};

export const createSubcategory = (data) => {
    return api.post('/subcategories', data);
};

export const updateSubcategory = (id, data) => {
    return api.put(`/subcategories/${id}`, data);
};

export const deleteSubcategory = (id) => {
    return api.delete(`/subcategories/${id}`);
};