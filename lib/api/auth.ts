/**
 * Authentication API functions
 */

import apiClient, { setTokens, clearTokens } from './client';
import { User, ApiResponse } from './types';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  user_type?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    setTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    setTokens(response.data.access_token, response.data.refresh_token);
    
    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    clearTokens();
    
    // Clear user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    
    // Optionally call backend logout endpoint
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // Admin login (uses same login endpoint but stores with admin_ prefix)
  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    // Use the regular login endpoint - backend determines role from user_type
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth API] Admin login response:', {
        hasUser: !!response.data.user,
        userType: response.data.user?.user_type,
        hasAccessToken: !!response.data.access_token,
        hasRefreshToken: !!response.data.refresh_token,
      });
    }
    
    // Verify user is admin
    if (!response.data.user) {
      throw new Error('Invalid response: user data missing');
    }
    
    if (response.data.user.user_type !== 'admin') {
      throw new Error('Access denied. Admin credentials required.');
    }
    
    // Store tokens with admin_ prefix
    setTokens(response.data.access_token, response.data.refresh_token, true);
    
    // Store admin user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_data', JSON.stringify(response.data.user));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth API] Admin data stored in localStorage');
        console.log('[Auth API] Verifying storage...');
        const stored = localStorage.getItem('admin_data');
        const storedToken = localStorage.getItem('admin_access_token');
        console.log('[Auth API] Stored admin_data:', stored ? JSON.parse(stored) : 'NOT FOUND');
        console.log('[Auth API] Stored admin_access_token:', storedToken ? 'Present' : 'NOT FOUND');
      }
    }
    
    return response.data;
  },

  // Get current admin user
  getCurrentAdmin: async (): Promise<User> => {
    const response = await apiClient.get<User>('/admin/auth/me');
    return response.data;
  },

  // Admin logout
  adminLogout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
    
    // Clear admin tokens
    clearTokens(true);
  },

  // Admin forgot password (uses same endpoint as regular users)
  adminForgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  // Admin reset password (uses same endpoint as regular users)
  adminResetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  // Google OAuth login/signup
  googleAuth: async (googleToken: string, userType: 'buyer' | 'creator' | 'seller' = 'buyer'): Promise<AuthResponse & { is_new_user: boolean }> => {
    const response = await apiClient.post<AuthResponse & { is_new_user: boolean }>('/auth/google', {
      token: googleToken,
      user_type: userType,
    });
    
    // Store tokens
    setTokens(response.data.access_token, response.data.refresh_token);
    
    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
};
