import { useState, useEffect } from 'react';
import { supportApi, SupportTicket as ApiSupportTicket, SupportMessage, CannedResponse } from '../support';

interface SupportTicket {
  id: string;
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
  tags: string[];
  sla_breach: boolean;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    attachments: string[];
    is_internal: boolean;
  }>;
  history?: Array<{
    id: string;
    admin_name: string;
    action: string;
    old_value?: string;
    new_value?: string;
    notes?: string;
    created_at: string;
  }>;
}

// Map API ticket to UI format
function mapTicketToUI(ticket: ApiSupportTicket): SupportTicket {
  return {
    id: ticket.id,
    user: ticket.user?.full_name || ticket.user?.username || ticket.user_id,
    userAvatar: "👤",
    email: ticket.user?.email || "user@example.com",
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    createdDate: new Date(ticket.created_at).toLocaleString(),
    lastUpdate: new Date(ticket.updated_at).toLocaleString(),
    assignedTo: ticket.assigned_admin?.full_name || ticket.assigned_to || "Unassigned",
    tags: ticket.tags || [],
    sla_breach: ticket.sla_breach || false,
    messages: (ticket.messages || []).map(msg => ({
      id: msg.id,
      sender: msg.sender_type,
      text: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: msg.attachments || [],
      is_internal: msg.is_internal || false,
    })),
    history: ticket.history,
  };
}

export function useAdminSupport(params?: { 
  status?: 'pending' | 'active' | 'resolved' | 'closed'; 
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  search?: string;
  assigned_to?: string;
  sla_breach?: boolean;
}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_tickets: 0,
    active_tickets: 0,
    pending_tickets: 0,
    resolved_today: 0,
    avg_response_time: "0 min",
    satisfaction_rate: "0%",
  });
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      // Fetch full ticket details including messages
      const ticketData = await supportApi.admin.getTicket(ticketId);
      const mappedTicket = mapTicketToUI(ticketData);
      
      // Update the ticket in the list with full details
      setTickets(prev => prev.map(t => t.id === ticketId ? mappedTicket : t));
      
      return mappedTicket;
    } catch (err: any) {
      console.error('Failed to fetch ticket details:', err);
      throw err;
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tickets from API
      const response = await supportApi.admin.getAllTickets({
        status: params?.status,
        category: params?.category,
        priority: params?.priority,
        search: params?.search,
        assigned_to: params?.assigned_to,
        sla_breach: params?.sla_breach,
        limit: 100,
      });
      
      // Map to UI format
      const mappedTickets = response.tickets.map(mapTicketToUI);
      setTickets(mappedTickets);
      
      // Fetch stats
      try {
        const statsData = await supportApi.admin.getStats();
        setStats({
          total_tickets: statsData.overview.total_tickets,
          active_tickets: statsData.overview.active,
          pending_tickets: statsData.overview.pending,
          resolved_today: statsData.overview.resolved,
          avg_response_time: statsData.sla_metrics.average_first_response_time,
          satisfaction_rate: `${statsData.satisfaction.average_rating.toFixed(1)}/5`,
        });
      } catch (statsErr: any) {
        console.warn('Stats endpoint not available, calculating from tickets:', statsErr.response?.status);
        
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        setStats({
          total_tickets: mappedTickets.length,
          active_tickets: mappedTickets.filter(t => t.status === 'active').length,
          pending_tickets: mappedTickets.filter(t => t.status === 'pending').length,
          resolved_today: mappedTickets.filter(t => {
            if (t.status !== 'resolved') return false;
            const updatedDate = new Date(t.lastUpdate);
            return updatedDate >= todayStart;
          }).length,
          avg_response_time: "N/A",
          satisfaction_rate: "N/A",
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch support tickets:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCannedResponses = async (category?: string) => {
    try {
      const response = await supportApi.admin.getCannedResponses({ category });
      setCannedResponses(response.responses);
    } catch (err: any) {
      console.error('Failed to fetch canned responses:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCannedResponses();
  }, [params?.status, params?.category, params?.priority, params?.search, params?.assigned_to, params?.sla_breach]);

  const updateTicketStatus = async (ticketId: string, status: 'pending' | 'active' | 'resolved' | 'closed', notes?: string) => {
    try {
      await supportApi.admin.updateTicketStatus(ticketId, status, notes);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to update ticket status:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to update ticket status');
      throw err;
    }
  };

  const assignTicket = async (ticketId: string, assignee: string | null, notes?: string) => {
    try {
      await supportApi.admin.assignTicket(ticketId, assignee, notes);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: assignee || 'Unassigned' } : t));
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to assign ticket:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to assign ticket');
      throw err;
    }
  };

  const updateTicketPriority = async (ticketId: string, priority: 'low' | 'medium' | 'high' | 'urgent', notes?: string) => {
    try {
      await supportApi.admin.updateTicketPriority(ticketId, priority, notes);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority } : t));
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to update priority:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to update priority');
      throw err;
    }
  };

  const sendMessage = async (ticketId: string, content: string, attachments?: string[], updateStatus?: string) => {
    try {
      await supportApi.admin.sendResponse(ticketId, content, attachments, updateStatus);
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to send message');
      throw err;
    }
  };

  const addInternalNote = async (ticketId: string, content: string, attachments?: string[]) => {
    try {
      await supportApi.admin.addInternalNote(ticketId, content, attachments);
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to add internal note:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to add internal note');
      throw err;
    }
  };

  const manageTags = async (ticketId: string, action: 'add' | 'remove', tags: string[]) => {
    try {
      await supportApi.admin.manageTags(ticketId, action, tags);
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to manage tags:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to manage tags');
      throw err;
    }
  };

  const bulkUpdate = async (ticketIds: string[], action: 'assign' | 'status' | 'priority' | 'add_tag' | 'remove_tag', value: string, notes?: string) => {
    try {
      const result = await supportApi.admin.bulkUpdate(ticketIds, action, value, notes);
      await fetchTickets();
      return result;
    } catch (err: any) {
      console.error('Failed to bulk update:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to bulk update');
      throw err;
    }
  };

  const createCannedResponse = async (title: string, content: string, category?: string, shortcut?: string) => {
    try {
      await supportApi.admin.createCannedResponse({ title, content, category, shortcut });
      await fetchCannedResponses();
    } catch (err: any) {
      console.error('Failed to create canned response:', err);
      throw err;
    }
  };

  const exportTickets = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const blob = await supportApi.admin.exportTickets({
        format,
        status: params?.status,
        category: params?.category,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `support-tickets-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Failed to export tickets:', err);
      throw err;
    }
  };

  return { 
    tickets, 
    loading, 
    error, 
    stats,
    cannedResponses,
    fetchTicketDetails,
    updateTicketStatus, 
    assignTicket,
    updateTicketPriority,
    sendMessage,
    addInternalNote,
    manageTags,
    bulkUpdate,
    createCannedResponse,
    exportTickets,
    refetch: fetchTickets,
    refetchCannedResponses: fetchCannedResponses,
  };
}
