/**
 * Authentication API functions
 */

import apiClient, { setTokens, clearTokens } from './client';
import { User, ApiResponse } from './types';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name: string;
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
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    clearTokens();
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
};
