/**
 * Checkout hooks
 */

import { useState } from 'react';
import { transactionsApi } from '../transactions';

export const useCheckout = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCheckout = async (paymentMethod: string, couponCode?: string) => {
    try {
      setProcessing(true);
      setError(null);
      
      const result = await transactionsApi.checkout({
        payment_method: paymentMethod,
        coupon_code: couponCode,
      });
      
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Checkout failed');
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processCheckout,
    processing,
    error,
  };
};

export const usePurchase = (transactionId: string) => {
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      // TODO: Add getPurchaseByTransaction endpoint to API
      const response = await transactionsApi.getPurchases(1, 1);
      setPurchase(response.purchases[0]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch purchase');
    } finally {
      setLoading(false);
    }
  };

  return {
    purchase,
    loading,
    error,
    fetchPurchase,
  };
};
