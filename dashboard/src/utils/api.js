import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  // 👉 Use an env variable so you can change the host without editing code
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:8000/api',
});

// Request interceptor – inject Bearer token if it exists
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;