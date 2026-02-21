/**
 * Authentication hooks
 */

import { useState, useEffect } from 'react';
import { authApi } from '../auth';
import { User } from '../types';
import { isAuthenticated } from '../client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (err) {
          setError('Failed to fetch user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, fullName?: string, userType?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register({ 
        email, 
        username, 
        password, 
        full_name: fullName,
        user_type: userType 
      });
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};
