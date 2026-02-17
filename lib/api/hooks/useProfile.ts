import { useState, useEffect } from 'react';
import { api } from '../index';
import { User } from '../types';

export function useProfile(username: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implement users API endpoint
        // const data = await api.users.getByUsername(username);
        // For now, return null until backend implements user profile endpoints
        setUser(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  return { user, loading, error };
}
