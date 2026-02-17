/**
 * Transactions & E-commerce API functions
 */

import apiClient from './client';
import { CartItem, Transaction, ApiResponse } from './types';

export interface CheckoutData {
  payment_method: string;
  coupon_code?: string;
}

export const transactionsApi = {
  // Cart operations
  addToCart: async (modelId: number): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/transactions/cart', { model_id: modelId });
    return response.data;
  },

  getCart: async (): Promise<{ cart_items: CartItem[]; subtotal: number; platform_fee: number; total: number }> => {
    const response = await apiClient.get('/transactions/cart');
    return response.data;
  },

  removeFromCart: async (modelId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/transactions/cart/${modelId}`);
    return response.data;
  },

  applyCoupon: async (couponCode: string): Promise<{ message: string; discount: number; new_total: number }> => {
    const response = await apiClient.post('/transactions/cart/apply-coupon', { coupon_code: couponCode });
    return response.data;
  },

  // Checkout
  checkout: async (data: CheckoutData): Promise<{ message: string; transaction_id: string; total_amount: number; redirect_url: string }> => {
    const response = await apiClient.post('/transactions/checkout', data);
    return response.data;
  },

  // Purchases
  getPurchases: async (page = 1, limit = 20): Promise<{ purchases: any[]; page: number; limit: number }> => {
    const response = await apiClient.get('/transactions/purchases', { params: { page, limit } });
    return response.data;
  },

  getDownloadLink: async (modelId: number): Promise<{ download_url: string; expires_at: string; downloads_remaining: number }> => {
    const response = await apiClient.get(`/transactions/purchases/${modelId}/download`);
    return response.data;
  },

  // Transaction history
  getHistory: async (page = 1, limit = 20): Promise<{ transactions: Transaction[]; page: number; limit: number }> => {
    const response = await apiClient.get('/transactions/history', { params: { page, limit } });
    return response.data;
  },
};
