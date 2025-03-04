import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8090/api',
  withCredentials: true
});
export default apiClient;
