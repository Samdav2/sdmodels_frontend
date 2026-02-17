/**
 * Main API export
 * Centralized access to all API functions
 */

export { default as apiClient } from './client';
export * from './types';
export * from './auth';
export * from './models';
export * from './blog';
export * from './transactions';

// Re-export for convenience
import { authApi } from './auth';
import { modelsApi } from './models';
import { blogApi } from './blog';
import { transactionsApi } from './transactions';

export const api = {
  auth: authApi,
  models: modelsApi,
  blog: blogApi,
  transactions: transactionsApi,
};

export default api;
