import api from 'axios';

export const adminLogin = (credentials) => {
    return api.post('/admin/login', credentials);
};