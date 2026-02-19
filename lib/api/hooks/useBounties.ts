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
        setBounties(data.bounties || data);
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

export const useBounty = (id: number) => {
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
        setError(err.response?.data?.message || 'Failed to fetch bounty');
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
        setBounties(data.bounties || data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch posted bounties');
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
        setBounties(data.bounties || data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch claimed bounties');
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return { bounties, loading, error };
};

export const useBountyApplications = (bountyId: number) => {
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
        setError(err.response?.data?.message || 'Failed to fetch applications');
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

export const useBountySubmission = (bountyId: number) => {
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
        setError(err.response?.data?.message || 'Failed to fetch submission');
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
