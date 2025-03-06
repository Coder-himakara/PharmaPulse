import apiClient from '../api/ApiClient';

export const executeJwtAuthenticationService = (username, password) =>
  apiClient.post('/users/login', { username, password });

export const logoutUserService = () => 
  apiClient.post('/auth/logout', {}, {
    withCredentials: true // Send refresh token cookie
  });

//Add refresh token service
export const refreshTokenService = () => 
  apiClient.post('/auth/refresh', {}, {
    withCredentials: true // Send cookies
  });
