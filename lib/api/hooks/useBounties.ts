import { useState, useEffect } from 'react';
import * as bountiesApi from '../bounties';

export const useBounties = (params?: {
  status?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}) => {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getBounties(params);
        const bountiesData = data.bounties || data;
        
        // Convert numeric IDs to strings if needed (backend compatibility)
        const normalizedBounties = bountiesData.map((bounty: any) => ({
          ...bounty,
          id: String(bounty.id), // Ensure ID is always a string
        }));
        
        setBounties(normalizedBounties);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bounties');
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, [params?.status, params?.category, params?.difficulty, params?.page, params?.limit]);

  return { bounties, loading, error };
};

export const useBounty = (id: string) => {
  const [bounty, setBounty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounty = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getBountyById(id);
        setBounty(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch bounty');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBounty();
    }
  }, [id]);

  return { bounty, loading, error, refetch: () => {} };
};

export const useMyPostedBounties = () => {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getMyPostedBounties();
        const bountiesData = data.bounties || data;
        
        // Debug: Log what backend returns
        console.log('[useMyPostedBounties] Backend response:', bountiesData);
        if (bountiesData.length > 0) {
          console.log('[useMyPostedBounties] First bounty ID type:', typeof bountiesData[0].id);
          console.log('[useMyPostedBounties] First bounty ID value:', bountiesData[0].id);
        }
        
        // Convert numeric IDs to strings if needed (backend compatibility)
        const normalizedBounties = bountiesData.map((bounty: any) => ({
          ...bounty,
          id: String(bounty.id), // Ensure ID is always a string
        }));
        
        setBounties(normalizedBounties);
        setError(null);
      } catch (err: any) {
        console.error('[useMyPostedBounties] Error:', err);
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch posted bounties');
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return { bounties, loading, error };
};

export const useMyClaimedBounties = () => {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getMyClaimedBounties();
        const bountiesData = data.bounties || data;
        
        // Convert numeric IDs to strings if needed (backend compatibility)
        const normalizedBounties = bountiesData.map((bounty: any) => ({
          ...bounty,
          id: String(bounty.id), // Ensure ID is always a string
        }));
        
        setBounties(normalizedBounties);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch claimed bounties');
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return { bounties, loading, error };
};

export const useBountyApplications = (bountyId: string) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getBountyApplications(bountyId);
        setApplications(data.applications || data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (bountyId) {
      fetchApplications();
    }
  }, [bountyId]);

  return { applications, loading, error };
};

export const useBountySubmission = (bountyId: string) => {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getBountySubmission(bountyId);
        setSubmission(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    if (bountyId) {
      fetchSubmission();
    }
  }, [bountyId]);

  return { submission, loading, error };
};

export const useBountyStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await bountiesApi.getBountyStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
