import apiClient from '../api/ApiClient ';

export const executeJwtAuthenticationService = (username, password) =>
  apiClient.post('/users/login', { username, password });

// Add refresh token service
export const refreshTokenService = (refreshToken) =>
  apiClient.post('/users/refresh-token', { refreshToken });
