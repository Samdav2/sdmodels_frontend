import { useState, useEffect } from 'react';
import { api } from '../index';
import { CartItem } from '../types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement cart API endpoint
      // const data = await api.cart.getItems();
      // For now, return empty cart until backend implements cart endpoints
      setItems([]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (modelId: number) => {
    try {
      // TODO: Implement cart API endpoint
      // await api.cart.addItem(modelId);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      // TODO: Implement cart API endpoint
      // await api.cart.removeItem(itemId);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      // TODO: Implement cart API endpoint
      // await api.cart.clear();
      setItems([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
    }
  };

  return { items, loading, error, addItem, removeItem, clearCart, refetch: fetchCart };
}
