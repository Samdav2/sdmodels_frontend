/**
 * Dashboard hooks for messages, social, financials, and settings
 */

import { useState, useEffect } from 'react';
import { dashboardApi } from '../dashboard';

// Messages Hook
export const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getMessages();
        setMessages(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const sendReply = async (messageId: string, text: string) => {
    try {
      const reply = await dashboardApi.sendReply(messageId, text);
      return reply;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send reply');
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await dashboardApi.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark as read');
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendReply,
    markAsRead,
  };
};

// Social Hook
export const useSocial = () => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        setLoading(true);
        const [followersData, statsData, activityData] = await Promise.all([
          dashboardApi.getFollowers(),
          dashboardApi.getSocialStats(),
          dashboardApi.getFollowerActivity(),
        ]);
        setFollowers(followersData);
        setStats(statsData);
        setActivity(activityData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch social data');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, []);

  return {
    followers,
    stats,
    activity,
    loading,
    error,
  };
};

// Financials Hook
export const useFinancials = () => {
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const [balanceData, transactionsData, earningsData] = await Promise.all([
          dashboardApi.getBalance(),
          dashboardApi.getTransactions(),
          dashboardApi.getEarnings(),
        ]);
        setBalance(balanceData);
        setTransactions(transactionsData);
        setEarnings(earningsData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const requestWithdrawal = async (amount: number, method: string) => {
    try {
      const withdrawal = await dashboardApi.requestWithdrawal(amount, method);
      return withdrawal;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to request withdrawal');
      throw err;
    }
  };

  return {
    balance,
    transactions,
    earnings,
    loading,
    error,
    requestWithdrawal,
  };
};

// Settings Hook
export const useSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getSettings();
        setSettings(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateProfile = async (data: any) => {
    try {
      const updated = await dashboardApi.updateProfile(data);
      setSettings((prev: any) => ({ ...prev, profile: updated }));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      throw err;
    }
  };

  const updateSecurity = async (data: any) => {
    try {
      const updated = await dashboardApi.updateSecurity(data);
      setSettings((prev: any) => ({ ...prev, security: updated }));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update security');
      throw err;
    }
  };

  const updateNotifications = async (data: any) => {
    try {
      const updated = await dashboardApi.updateNotifications(data);
      setSettings((prev: any) => ({ ...prev, notifications: updated }));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update notifications');
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateProfile,
    updateSecurity,
    updateNotifications,
  };
};
