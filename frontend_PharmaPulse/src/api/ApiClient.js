import axios from 'axios';

// Use environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';

console.log('API URL:', API_URL); // For debugging during deployment

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default apiClient;