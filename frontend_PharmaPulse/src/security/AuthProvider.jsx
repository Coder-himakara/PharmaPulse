import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';

import {
  executeJwtAuthenticationService,
  logoutUserService,
  refreshTokenService,
} from '../api/AuthenticationApiService';

import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/ApiClient';

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef(null);

  // Calculate time until token expiration (in milliseconds)
  const getTimeUntilExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return expirationTime - currentTime;
    } catch (error) {
      console.error("Failed to calculate token expiration:", error);
      return 0;
    }
  };

  // Function to set up automatic token refresh before expiration
  const setupRefreshTimer = useCallback((token) => {
    if (!token) return;

    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const timeUntilExpiration = getTimeUntilExpiration(token);
    // Refresh 1 minute before expiration, or immediately if less than 2 minutes left
    const refreshTime = Math.max(0, timeUntilExpiration - (60 * 1000));

    console.log(`Token expires in ${timeUntilExpiration / 1000} seconds, scheduling refresh in ${refreshTime / 1000} seconds`);

    if (timeUntilExpiration <= 0) {
      // Token already expired, refresh immediately
      refreshToken();
      return;
    }

    refreshTimeoutRef.current = setTimeout(refreshToken, refreshTime);
  }, []);

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      console.log("Attempting to refresh token");

      const { data } = await refreshTokenService();
      const newToken = data.data.newAccessToken;
      const newRole = data.data.role;

      console.log("Token refresh successful");

      // Update state and storage
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);

      setAuthState({
        token: newToken,
        role: newRole,
        isAuthenticated: true,
      });

      // Set up the next refresh
      setupRefreshTimer(newToken);

    } catch (error) {
      console.error("Token refresh failed:", error);
      // On refresh failure, clear auth and log out
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      setAuthState({
        token: null,
        role: null,
        isAuthenticated: false,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, setupRefreshTimer]);

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (error) {
      console.error('Token decode failed:', error);
      return true;
    }
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const initializeAuth = async () => {
      if (token && role) {
        if (isTokenExpired(token)) {
          console.log("Stored token is expired, attempting refresh");
          refreshToken();
        } else {
          // Token still valid - set auth state and schedule refresh
          setAuthState({
            token,
            role,
            isAuthenticated: true,
          });

          // Set up refresh timer for the valid token
          setupRefreshTimer(token);
        }
      }
    };

    initializeAuth();

    // Cleanup function to clear timeout
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshToken, setupRefreshTimer]);

  const login = async (username, password) => {
    try {
      // Clear existing tokens before new login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete apiClient.defaults.headers.common['Authorization'];

      const response = await executeJwtAuthenticationService(username, password);
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      const role = response.data.data.userInfo.role;
      localStorage.setItem('role', role);

      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });

      // Set up refresh timer for the new token
      setupRefreshTimer(token);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      // Clear refresh timer
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      await logoutUserService(undefined, {
        withCredentials: true,
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setAuthState({
        token: null,
        role: null,
        isAuthenticated: false,
      });
    }
  }, []);

  // Axios request interceptor
  useLayoutEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      // Skip auth header for login/logout
      if (
        config.url.includes('users/login') ||
        config.url.includes('/auth/logout')
      ) {
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
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Skip handling for login and refresh token requests
        if (
          originalRequest.url.includes('/users/login') ||
          originalRequest.url.includes('/auth/refresh')
        ) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("401 error - attempting token refresh");
            await refreshToken();

            // If refresh was successful, retry with new token
            if (authState.token) {
              originalRequest.headers.Authorization = `Bearer ${authState.token}`;
              return apiClient(originalRequest);
            }

            // If we got here but don't have a token, refresh failed
            return Promise.reject(error);
          } catch (refreshError) {
            // Force logout if refresh failed
            console.error("Refresh failed during 401 handling:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => apiClient.interceptors.response.eject(responseInterceptor);
  }, [authState.token, refreshToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        role: authState.role,
        token: authState.token,
        isRefreshing,
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