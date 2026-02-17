/**
 * Main API export
 * Centralized access to all API functions
 */

export { default as apiClient } from './client';
export * from './types';
export * from './auth';
export * from './users';
export * from './models';
export * from './blog';
export * from './transactions';
export * from './communities';
export * from './collections';
export * from './admin';
export * from './support';
export * from './dashboard';

// Re-export for convenience
import { authApi } from './auth';
import { usersApi } from './users';
import { modelsApi } from './models';
import { blogApi } from './blog';
import { transactionsApi } from './transactions';
import { communitiesApi } from './communities';
import { collectionsApi } from './collections';
import { adminApi } from './admin';
import { supportApi } from './support';
import { dashboardApi } from './dashboard';

export const api = {
  auth: authApi,
  users: usersApi,
  models: modelsApi,
  blog: blogApi,
  transactions: transactionsApi,
  communities: communitiesApi,
  collections: collectionsApi,
  admin: adminApi,
  support: supportApi,
  dashboard: dashboardApi,
};

export default api;
