// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', // remove /v1 unless backend has it
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      // optionally clear user in AuthContext
      const path = window.location?.pathname || '';
      const isOnAuthPage = path === '/login' || path === '/register';
      const url = (error.config && (error.config.url || '')) || '';
      const isSelfCheck = url.includes('/auth/me');

      if (!isOnAuthPage && !isSelfCheck) {
        try {
          window.history.pushState({}, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch {
          window.location.assign('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);


export default api;
