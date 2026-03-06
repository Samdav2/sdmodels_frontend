/**
 * SDModels API Client
 * Base configuration and axios instance
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
// IMPORTANT: Use direct backend URL to ensure Authorization headers are not stripped by Next.js proxy
// The proxy can sometimes strip or modify headers, causing authentication issues
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = 30000; // 30 seconds

// Debug: Log API configuration
if (process.env.NODE_ENV === 'development') {
  console.log('[API Client] Using API Base URL:', API_BASE_URL);
  console.log('[API Client] Direct backend connection (bypassing Next.js proxy)');
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and proactively refresh if needed
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Proactively refresh token if it's about to expire
    await refreshTokenIfNeeded();
    
    // Auto-detect if this is an admin session
    const isAdmin = isAdminSession();
    const token = getAccessToken(isAdmin);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: Log that token was added (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Client] Added ${isAdmin ? 'Admin' : 'User'} Authorization header to request:`, config.url);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[API Client] No token available for request:', config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Auto-detect if this is an admin session
        const isAdmin = isAdminSession();
        const refreshToken = getRefreshToken(isAdmin);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Client] Refreshing ${isAdmin ? 'admin' : 'user'} access token...`);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        // Store BOTH new tokens
        setTokens(access_token, new_refresh_token, isAdmin);

        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Client] ${isAdmin ? 'Admin' : 'User'} token refresh successful`);
        }

        // Process queued requests
        processQueue(null, access_token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        const isAdmin = isAdminSession();
        processQueue(refreshError, null);
        clearTokens(isAdmin);
        
        if (process.env.NODE_ENV === 'development') {
          console.error('[API Client] Token refresh failed:', refreshError);
        }
        
        if (typeof window !== 'undefined') {
          window.location.href = isAdmin ? '/admin/login' : '/auth?session=expired';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Token management functions
// Support both admin and user tokens with separate storage keys
export const getAccessToken = (isAdmin: boolean = false): string | null => {
  if (typeof window === 'undefined') return null;
  const key = isAdmin ? 'admin_access_token' : 'access_token';
  const token = localStorage.getItem(key);
  // Debug: Log token status (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Client] ${isAdmin ? 'Admin' : 'User'} access token:`, token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
  }
  return token;
};

export const getRefreshToken = (isAdmin: boolean = false): string | null => {
  if (typeof window === 'undefined') return null;
  const key = isAdmin ? 'admin_refresh_token' : 'refresh_token';
  return localStorage.getItem(key);
};

export const setAccessToken = (token: string, isAdmin: boolean = false): void => {
  if (typeof window !== 'undefined') {
    const key = isAdmin ? 'admin_access_token' : 'access_token';
    const timeKey = isAdmin ? 'admin_token_set_at' : 'token_set_at';
    localStorage.setItem(key, token);
    // Store timestamp when token was set
    localStorage.setItem(timeKey, Date.now().toString());
  }
};

export const setRefreshToken = (token: string, isAdmin: boolean = false): void => {
  if (typeof window !== 'undefined') {
    const key = isAdmin ? 'admin_refresh_token' : 'refresh_token';
    localStorage.setItem(key, token);
  }
};

export const setTokens = (accessToken: string, refreshToken: string, isAdmin: boolean = false): void => {
  setAccessToken(accessToken, isAdmin);
  setRefreshToken(refreshToken, isAdmin);
};

export const clearTokens = (isAdmin: boolean = false): void => {
  if (typeof window !== 'undefined') {
    const prefix = isAdmin ? 'admin_' : '';
    localStorage.removeItem(`${prefix}access_token`);
    localStorage.removeItem(`${prefix}refresh_token`);
    localStorage.removeItem(`${prefix}token_set_at`);
    localStorage.removeItem(`${prefix}data`);
    // Also clear 'user' key for backward compatibility
    if (!isAdmin) {
      localStorage.removeItem('user');
    }
  }
};

export const isAuthenticated = (isAdmin: boolean = false): boolean => {
  return !!getAccessToken(isAdmin);
};

// Detect if current session is admin
// IMPORTANT: Check both localStorage AND current URL path
export const isAdminSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if we're on an admin page
  const isAdminPath = window.location.pathname.startsWith('/admin');
  
  // If we're NOT on an admin path, we should NEVER use admin tokens
  if (!isAdminPath) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Client] isAdminSession: Not on admin path, using USER token');
    }
    return false;
  }
  
  // Only check admin_data if we're actually on an admin path
  const adminData = localStorage.getItem('admin_data');
  if (!adminData) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Client] isAdminSession: No admin_data found in localStorage');
    }
    return false;
  }
  try {
    const user = JSON.parse(adminData);
    const isAdmin = user.user_type === 'admin';
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Client] isAdminSession:', {
        hasAdminData: true,
        userType: user.user_type,
        isAdmin,
        path: window.location.pathname,
      });
    }
    return isAdmin;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Client] isAdminSession: Failed to parse admin_data', error);
    }
    return false;
  }
};

// Check if token is about to expire (within 5 minutes)
export const shouldRefreshToken = (isAdmin: boolean = false): boolean => {
  if (typeof window === 'undefined') return false;
  
  const timeKey = isAdmin ? 'admin_token_set_at' : 'token_set_at';
  const tokenSetAt = localStorage.getItem(timeKey);
  if (!tokenSetAt) return false;
  
  const setTime = parseInt(tokenSetAt);
  const now = Date.now();
  const elapsed = now - setTime;
  
  // Access token expires in 60 minutes, refresh if 55+ minutes have passed
  const FIFTY_FIVE_MINUTES = 55 * 60 * 1000;
  
  return elapsed >= FIFTY_FIVE_MINUTES;
};

// Proactively refresh token if needed
export const refreshTokenIfNeeded = async (): Promise<void> => {
  // Auto-detect if this is an admin session
  const isAdmin = isAdminSession();
  
  if (!shouldRefreshToken(isAdmin)) return;
  
  try {
    const refreshToken = getRefreshToken(isAdmin);
    if (!refreshToken) return;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Client] Proactively refreshing ${isAdmin ? 'admin' : 'user'} token...`);
    }
    
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });
    
    const { access_token, refresh_token: new_refresh_token } = response.data;
    setTokens(access_token, new_refresh_token, isAdmin);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Client] Proactive ${isAdmin ? 'admin' : 'user'} token refresh successful`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Client] Proactive token refresh failed:', error);
    }
  }
};

export default apiClient;
