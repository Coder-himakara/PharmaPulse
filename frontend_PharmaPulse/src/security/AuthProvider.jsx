import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import {
  executeJwtAuthenticationService,
  logoutUserService,
  refreshTokenService,
} from '../api/AuthenticationApiService';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/ApiClient'; // Uncomment if needed

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const initializeAuth = async () => {
      if (token && role) {
        if (isTokenExpired(token)) {
          try {
            // Try to refresh the token before logging out
            setIsRefreshing(true);
            const { data } = await refreshTokenService();
            const newToken = data.data.newAccessToken;
            const newRole = data.data.role;

            // Update state and storage
            localStorage.setItem('token', newToken);
            localStorage.setItem('role', newRole);
            setAuthState({
              token: newToken,
              role: newRole,
              isAuthenticated: true
            });
            setIsRefreshing(false);
          } catch (error) {
            console.log('Token refresh failed on initialization');
            // Refresh failed, clear storage and go to login
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setAuthState({ token: null, role: null, isAuthenticated: false });
            setIsRefreshing(false);
          }
        } else {
          // Token still valid
          setAuthState({
            token,
            role,
            isAuthenticated: true
          });
        }
      }
    };

    initializeAuth();
  }, []);

  // Check token expiration periodically
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (authState.token && isTokenExpired(authState.token) && !isRefreshing) {
  //       logout();
  //     }
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [authState.token, isRefreshing]);

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
      // Clear existing tokens before new login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete apiClient.defaults.headers.common['Authorization'];

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

  const logout = useCallback(async () => {
    try {
      await logoutUserService(undefined, {
        withCredentials: true // Send cookies
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setAuthState({
        token: null,
        role: null,
        isAuthenticated: false
      });
    }
  }, []);

  // Axios request interceptor
  useLayoutEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      // Skip auth header for login/logout
      if (config.url.includes('users/login') || config.url.includes('/auth/logout')) {
        return config;
      }

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
      response => response,
      async (error) => {
        const originalRequest = error.config;

        // Skip handling for login requests
        if (originalRequest.url.includes('/users/login')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            originalRequest._retry = true;
            setIsRefreshing(true);

            const { data } = await refreshTokenService();
            const newToken = data.data.newAccessToken;
            const role = data.data.role;

            // Update state and storage
            localStorage.setItem('token', newToken);
            localStorage.setItem('role', role);
            setAuthState({
              token: newToken,
              role,
              isAuthenticated: true
            });

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Handle refresh token expiration
            if (refreshError.response?.status === 401) {
              console.log('Refresh token expired - forcing logout');
              logout();
            }
            return Promise.reject(refreshError);
          } finally {
            setIsRefreshing(false);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => apiClient.interceptors.response.eject(responseInterceptor);
  }, [logout]); // Add logout to dependencies

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
