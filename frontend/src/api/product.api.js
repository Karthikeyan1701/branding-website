import api from './axios';

export const getProducts = () => {
    return api.get('/products');
};

export const getProductsBySubcategory = (subcategoryId) => {
    return api.get(`/products/subcategory/${subcategoryId}`);
};

export const createProduct = (data) => {
    return api.post('/products', data);
};

export const updateProduct = (id, data) => {
    return api.put(`products/${id}`, data);
};

export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};