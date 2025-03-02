import { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import { executeJwtAuthenticationService } from '../api/AuthenticationApiService';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/ApiClient'; // Uncomment if needed

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setAuthState({
        token,
        role,
        isAuthenticated: !isTokenExpired(token),
      });
    }
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (authState.token && isTokenExpired(authState.token)) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.token]);

  const isTokenExpired = (token) => {
    try {
      // decode token and check expiration
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (error) {
      console.error('Token decode failed:', error);
      return true;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await executeJwtAuthenticationService(
        username,
        password,
      );
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      const role = response.data.data.userInfo.role;
      localStorage.setItem('role', role);

      // If you need to set default axios headers for auth
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Remove auth headers if you've set them
    // delete apiClient.defaults.headers.common['Authorization'];

    setAuthState({
      token: null,
      role: null,
      isAuthenticated: false,
    });
  };
  // Axios request interceptor
  useLayoutEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      if (authState.token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authState.token}`;
      }
      return config;
    });

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [authState.token]);

  // Axios response interceptor for token refresh
  useLayoutEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await apiClient.post('/auth/refresh-token', {
              refreshToken: localStorage.getItem('refreshToken'),
            });

            const newToken = response.data.accessToken;
            localStorage.setItem('token', newToken);

            setAuthState((prev) => ({
              ...prev,
              token: newToken,
              isAuthenticated: true,
            }));

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [authState.token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        role: authState.role,
        token: authState.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
