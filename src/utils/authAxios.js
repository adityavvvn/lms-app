import axios from 'axios';

let baseURL = process.env.REACT_APP_API_URL;
if (!baseURL) {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    baseURL = 'http://localhost:5000';
  } else {
    baseURL = 'https://lms-app-backend-nobf.onrender.com';
  }
}

const authAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authAxios; 