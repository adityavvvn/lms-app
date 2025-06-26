import axios from 'axios';

let baseURL = process.env.REACT_APP_API_URL;
if (!baseURL) {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    baseURL = 'http://localhost:5000';
  } else {
    baseURL = 'https://lms-app-backend-nobf.onrender.com';
  }
}

const publicAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default publicAxios; 