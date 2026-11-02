import axios from 'axios';

// One API URL for local development and deployment (configured in .env).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';
