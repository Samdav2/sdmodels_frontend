import { useState, useEffect } from 'react';
import { api } from '../index';
import { Notification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement notifications API endpoint
      // const data = await api.notifications.getAll();
      // For now, return empty array until backend implements notification endpoints
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      // TODO: Implement notifications API endpoint
      // await api.notifications.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message || 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Implement notifications API endpoint
      // await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to mark all as read');
    }
  };

  return { 
    notifications, 
    loading, 
    error, 
    unreadCount,
    markAsRead, 
    markAllAsRead,
    refetch: fetchNotifications 
  };
}
