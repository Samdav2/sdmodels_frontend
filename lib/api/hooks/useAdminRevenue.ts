import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminRevenue(startDate?: string, endDate?: string) {
  const [revenue, setRevenue] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getRevenue();
      setRevenue(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch revenue data');
      setRevenue(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1, limit = 20) => {
    try {
      const data = await api.admin.getTransactions(page, limit);
      setTransactions(data.transactions || []);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      return { transactions: [], total: 0 };
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [startDate, endDate]);

  return { 
    revenue, 
    transactions, 
    loading, 
    error, 
    refetch: fetchRevenue,
    fetchTransactions 
  };
}
