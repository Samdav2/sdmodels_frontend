import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getRevenue();
        
        // Mock data for now
        setRevenue({
          stats: {
            totalRevenue: 125430,
            platformFees: 9407,
            monthlyRevenue: 3245,
            avgTransaction: 125,
          },
          transactions: [
            { id: 1, model: "Cyberpunk Mech", buyer: "GameDev Studios", amount: 150, fee: 11.25, date: "2024-02-16 14:30" },
            { id: 2, model: "Dragon Animated", buyer: "IndieCreator", amount: 89, fee: 6.68, date: "2024-02-16 12:15" },
            { id: 3, model: "Sci-Fi Vehicle", buyer: "VR Company", amount: 200, fee: 15.00, date: "2024-02-16 09:45" },
            { id: 4, model: "Fantasy Castle", buyer: "Mobile Games", amount: 120, fee: 9.00, date: "2024-02-15 18:20" },
          ],
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { revenue, loading, error };
}
