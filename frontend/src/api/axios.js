import axios from 'axios';
import { getToken, clearToken } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach token to every request

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            alert("Network error. Please check your internet connection.");
            return Promise.reject(error);
        }

        const { status } = error.response;

        // Unauthorized or expired token handling
        if (status === 401 || status === 403) {
            clearToken();
            alert("Session expired. Please login again.");
            window.location.href = '/admin';
            return;
        }

        // Server error
        if (status >= 500) {
            alert("Server error. Please try again later.");
        }

        return Promise.reject(error);
    }
);

export default api;
