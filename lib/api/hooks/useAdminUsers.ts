import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminUsers(searchQuery = '') {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getUsers(1, 100, searchQuery);
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const verifyUser = async (userId: number) => {
    try {
      await api.admin.verifyCreator(userId);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to verify user');
    }
  };

  const banUser = async (userId: number) => {
    try {
      await api.admin.banUser(userId);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to ban user');
    }
  };

  return { users, loading, error, total, verifyUser, banUser, refetch: fetchUsers };
}
