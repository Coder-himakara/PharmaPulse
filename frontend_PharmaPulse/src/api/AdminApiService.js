import apiClient from '../api/ApiClient';

export const registerUsers = (userData) =>
  apiClient.post('/users/register', userData);
