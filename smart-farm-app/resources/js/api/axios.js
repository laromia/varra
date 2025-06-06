import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust if needed
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Set token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
