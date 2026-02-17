import { useState, useEffect } from 'react';

interface SupportTicket {
  id: number;
  user: string;
  userAvatar: string;
  email: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  messages: Array<{
    id: number;
    sender: string;
    text: string;
    time: string;
    attachments: string[];
  }>;
}

export function useAdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const response = await api.admin.getSupportTickets();
      
      // Mock data for now
      setTickets([
        {
          id: 1,
          user: "Alex Chen",
          userAvatar: "🎨",
          email: "alex@example.com",
          subject: "Payment Issue - Transaction Failed",
          status: "active",
          priority: "high",
          category: "Payment",
          createdDate: "2024-02-16 10:30",
          lastUpdate: "2 min ago",
          assignedTo: "Admin Team",
          messages: [
            {
              id: 1,
              sender: "user",
              text: "Hi, I tried to purchase a 3D model but my payment failed.",
              time: "10:30 AM",
              attachments: ["screenshot.png"],
            },
          ],
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId: number, status: string) => {
    try {
      // TODO: Call API
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket status');
    }
  };

  const assignTicket = async (ticketId: number, assignee: string) => {
    try {
      // TODO: Call API
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: assignee } : t));
    } catch (err: any) {
      setError(err.message || 'Failed to assign ticket');
    }
  };

  return { tickets, loading, error, updateTicketStatus, assignTicket, refetch: fetchTickets };
}
