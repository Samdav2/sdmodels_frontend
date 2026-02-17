import { useState, useEffect } from 'react';

export function useAdminBounties() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [settings, setSettings] = useState({ minAmount: 50, platformFee: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getBounties();
        
        // Mock data for now
        setBounties([
          { id: 1, title: "Sci-Fi Character Rig", budget: 500, creator: "GameStudio", status: "Open", applicants: 5 },
          { id: 2, title: "Medieval Weapon Pack", budget: 300, creator: "IndieGame", status: "In Progress", applicants: 1 },
          { id: 3, title: "Futuristic Vehicle", budget: 750, creator: "VRCompany", status: "Completed", applicants: 8 },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bounties');
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  const closeBounty = async (id: number) => {
    try {
      // TODO: Call API
      setBounties(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to close bounty');
    }
  };

  return { bounties, settings, loading, error, closeBounty, setSettings };
}
