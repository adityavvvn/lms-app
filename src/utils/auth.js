// Get the JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Set the JWT token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove the JWT token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Get user data from localStorage
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Set user data in localStorage
export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Remove user data from localStorage
export const removeUser = () => {
    localStorage.removeItem('user');
};

// Create axios instance with auth header
import axios from 'axios';

export const authAxios = axios.create({
    baseURL: 'https://lms-app-backend-nobf.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to all requests
authAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            removeToken();
            removeUser();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 