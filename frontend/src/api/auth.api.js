import api from "./axios.js"

export const adminLogin = (credentials) => {
    return api.post('/admin/login', credentials);
};