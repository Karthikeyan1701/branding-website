import axios from 'axios';
import { getToken, clearToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
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
  (error) => Promise.reject(error),
);

// Response Interceptor - Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'NETWORK_ERROR',
      });
    }

    const { status, data } = error.response;

    // Unauthorized or expired token authentication error handling
    if (status === 401 || status === 403) {
      clearToken();
      window.location.href = '/admin';
      return Promise.reject({
        message: 'Session expired. Please login again.',
        type: 'AUTH_ERROR',
      });
    }

    // Server error
    if (status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        type: 'SERVER_ERROR',
      })
    }

    // Default API error
    return Promise.reject({
      message: data?.message || 'Request failed',
      type: 'API_ERROR',
    });
  },
);

export default api;
