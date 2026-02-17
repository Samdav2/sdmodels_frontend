/**
 * Followers hooks
 */

import { useState, useEffect } from 'react';
import { usersApi } from '../users';

export const useFollowers = (userId: number) => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getFollowers(userId);
        setFollowers(data.items || (data as any).followers || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch followers');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  const followUser = async (targetUserId: number) => {
    try {
      await usersApi.followUser(targetUserId);
      // Optionally refresh followers list
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to follow user');
      throw err;
    }
  };

  const unfollowUser = async (targetUserId: number) => {
    try {
      await usersApi.unfollowUser(targetUserId);
      // Optionally refresh followers list
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to unfollow user');
      throw err;
    }
  };

  return {
    followers,
    loading,
    error,
    followUser,
    unfollowUser,
  };
};

export const useFollowing = (userId: number) => {
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getFollowing(userId);
        setFollowing(data.items || (data as any).following || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch following');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  return {
    following,
    loading,
    error,
  };
};
