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

  // Admin login (uses dedicated admin endpoint with separate admin_users table)
  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/admin/auth/login', data);
    
    // Store tokens and admin data
    setTokens(response.data.access_token, response.data.refresh_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      localStorage.setItem('user', JSON.stringify(response.data.user)); // For compatibility
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
      await apiClient.post('/admin/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
    
    clearTokens();
    
    // Clear admin data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('user');
    }
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
};
