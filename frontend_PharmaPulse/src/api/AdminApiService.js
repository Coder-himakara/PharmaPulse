import apiClient from './ApiClient';

export const registerUsers = (formData) =>
  apiClient.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
