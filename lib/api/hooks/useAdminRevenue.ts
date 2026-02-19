import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminRevenue() {
  const [revenue, setRevenue] = useState({
    stats: {
      totalRevenue: 0,
      platformFees: 0,
      monthlyRevenue: 0,
      avgTransaction: 0,
    },
    transactions: [] as Array<{
      id: number;
      model: string;
      buyer: string;
      amount: number;
      fee: number;
      date: string;
    }>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const [revenueData, transactionsData] = await Promise.all([
        adminApi.getRevenue(),
        adminApi.getTransactions(),
      ]);
      
      setRevenue({
        stats: revenueData.stats || {
          totalRevenue: 0,
          platformFees: 0,
          monthlyRevenue: 0,
          avgTransaction: 0,
        },
        transactions: transactionsData.items || transactionsData || [],
      });
    } catch (err: any) {
      console.error('Failed to fetch revenue:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return { revenue, loading, error, refetch: fetchRevenue };
}
