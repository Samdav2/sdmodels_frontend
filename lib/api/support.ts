/**
 * Support API functions
 */

import apiClient from './client';

export interface SupportTicket {
  id: string;
  ticket_number?: string;
  user_id: string;
  subject: string;
  category: 'Payment' | 'Technical' | 'Account' | 'Refund' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'active' | 'resolved' | 'closed';
  assigned_to?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  first_response_at?: string;
  sla_breach?: boolean;
  satisfaction_rating?: number;
  satisfaction_comment?: string;
  messages?: SupportMessage[];
  user?: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  assigned_admin?: {
    id: string;
    username: string;
    full_name: string;
  };
  history?: TicketHistoryEntry[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  sender_name?: string;
  content: string;
  attachments?: string[];
  is_internal?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TicketHistoryEntry {
  id: string;
  ticket_id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  old_value?: string;
  new_value?: string;
  notes?: string;
  created_at: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  category?: string;
  shortcut?: string;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketData {
  subject: string;
  category: 'Payment' | 'Technical' | 'Account' | 'Refund' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
}

export interface SendMessageData {
  content: string;
  attachments?: string[];
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
  views: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export const supportApi = {
  // Get all tickets for current user
  getTickets: async (params?: { page?: number; limit?: number }): Promise<{ tickets: SupportTicket[]; page: number; limit: number }> => {
    const response = await apiClient.get('/support/tickets', { params });
    return response.data;
  },

  // Get single ticket with messages
  getTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await apiClient.get(`/support/tickets/${ticketId}`);
    return response.data;
  },

  // Create new ticket
  createTicket: async (data: CreateTicketData): Promise<SupportTicket> => {
    const response = await apiClient.post('/support/tickets', data);
    return response.data;
  },

  // Send message to ticket
  sendMessage: async (ticketId: string, data: SendMessageData): Promise<SupportMessage> => {
    const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, data);
    return response.data;
  },

  // Update ticket status (admin only)
  updateTicketStatus: async (ticketId: string, status: 'pending' | 'active' | 'resolved'): Promise<SupportTicket> => {
    const response = await apiClient.put(`/support/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  // Assign ticket (admin only)
  assignTicket: async (ticketId: string, assignedTo: string): Promise<SupportTicket> => {
    const response = await apiClient.put(`/support/tickets/${ticketId}/assign`, { assigned_to: assignedTo });
    return response.data;
  },

  // Get FAQs
  getFAQs: async (params?: { category?: string }): Promise<FAQ[]> => {
    const response = await apiClient.get('/support/faqs', { params });
    return response.data.faqs || response.data || [];
  },

  // Get single FAQ
  getFAQ: async (faqId: string): Promise<FAQ> => {
    const response = await apiClient.get(`/support/faqs/${faqId}`);
    return response.data;
  },

  // Mark FAQ as helpful
  markFAQHelpful: async (faqId: string): Promise<void> => {
    await apiClient.post(`/support/faqs/${faqId}/helpful`);
  },

  // Admin endpoints
  admin: {
    // Get all tickets (admin only)
    getAllTickets: async (params?: { 
      status?: 'pending' | 'active' | 'resolved' | 'closed'; 
      category?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assigned_to?: string;
      page?: number; 
      limit?: number;
      search?: string;
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
      date_from?: string;
      date_to?: string;
      sla_breach?: boolean;
    }): Promise<{ tickets: SupportTicket[]; total: number; page: number; limit: number; total_pages: number }> => {
      const response = await apiClient.get('/admin/support/tickets', { params });
      return response.data;
    },

    // Get single ticket with full details (admin only)
    getTicket: async (ticketId: string): Promise<SupportTicket> => {
      const response = await apiClient.get(`/admin/support/tickets/${ticketId}`);
      return response.data;
    },

    // Get ticket statistics (admin only)
    getStats: async (params?: {
      date_from?: string;
      date_to?: string;
      admin_id?: string;
    }): Promise<{
      overview: {
        total_tickets: number;
        pending: number;
        active: number;
        resolved: number;
        closed: number;
      };
      by_category: Record<string, number>;
      by_priority: Record<string, number>;
      sla_metrics: {
        average_first_response_time: string;
        average_resolution_time: string;
        sla_breach_count: number;
        sla_compliance_rate: string;
      };
      satisfaction: {
        average_rating: number;
        total_ratings: number;
        rating_distribution: Record<string, number>;
      };
      admin_performance?: Array<{
        admin_id: string;
        admin_name: string;
        tickets_handled: number;
        average_response_time: string;
        average_resolution_time: string;
        satisfaction_rating: number;
      }>;
    }> => {
      const response = await apiClient.get('/admin/support/stats', { params });
      return response.data;
    },

    // Update ticket status (admin only)
    updateTicketStatus: async (ticketId: string, status: 'pending' | 'active' | 'resolved' | 'closed', notes?: string): Promise<SupportTicket> => {
      const response = await apiClient.put(`/admin/support/tickets/${ticketId}/status`, { status, notes });
      return response.data;
    },

    // Assign ticket (admin only)
    assignTicket: async (ticketId: string, assignedTo: string | null, notes?: string): Promise<SupportTicket> => {
      const response = await apiClient.put(`/admin/support/tickets/${ticketId}/assign`, { assigned_to: assignedTo, notes });
      return response.data;
    },

    // Update ticket priority (admin only)
    updateTicketPriority: async (ticketId: string, priority: 'low' | 'medium' | 'high' | 'urgent', notes?: string): Promise<SupportTicket> => {
      const response = await apiClient.put(`/admin/support/tickets/${ticketId}/priority`, { priority, notes });
      return response.data;
    },

    // Add internal note (admin only, not visible to user)
    addInternalNote: async (ticketId: string, content: string, attachments?: string[]): Promise<SupportMessage> => {
      const response = await apiClient.post(`/admin/support/tickets/${ticketId}/notes`, { content, attachments });
      return response.data;
    },

    // Send response to user (admin only)
    sendResponse: async (ticketId: string, content: string, attachments?: string[], updateStatus?: string): Promise<SupportMessage> => {
      const response = await apiClient.post(`/admin/support/tickets/${ticketId}/respond`, { 
        content, 
        attachments,
        update_status: updateStatus 
      });
      return response.data;
    },

    // Bulk update tickets (admin only)
    bulkUpdate: async (ticketIds: string[], action: 'assign' | 'status' | 'priority' | 'add_tag' | 'remove_tag', value: string, notes?: string): Promise<{
      updated: number;
      failed: number;
      results: Array<{ ticket_id: string; success: boolean; error?: string }>;
    }> => {
      const response = await apiClient.post('/admin/support/tickets/bulk-update', { 
        ticket_ids: ticketIds, 
        action, 
        value,
        notes 
      });
      return response.data;
    },

    // Manage ticket tags (admin only)
    manageTags: async (ticketId: string, action: 'add' | 'remove', tags: string[]): Promise<SupportTicket> => {
      const response = await apiClient.post(`/admin/support/tickets/${ticketId}/tags`, { action, tags });
      return response.data;
    },

    // Export tickets (admin only)
    exportTickets: async (params?: {
      format?: 'csv' | 'json';
      status?: string;
      category?: string;
      date_from?: string;
      date_to?: string;
    }): Promise<Blob> => {
      const response = await apiClient.get('/admin/support/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    },

    // Canned Responses
    getCannedResponses: async (params?: { category?: string }): Promise<{ responses: CannedResponse[] }> => {
      const response = await apiClient.get('/admin/support/canned-responses', { params });
      return response.data;
    },

    createCannedResponse: async (data: {
      title: string;
      content: string;
      category?: string;
      shortcut?: string;
    }): Promise<CannedResponse> => {
      const response = await apiClient.post('/admin/support/canned-responses', data);
      return response.data;
    },

    updateCannedResponse: async (responseId: string, data: {
      title?: string;
      content?: string;
      category?: string;
      shortcut?: string;
    }): Promise<CannedResponse> => {
      const response = await apiClient.put(`/admin/support/canned-responses/${responseId}`, data);
      return response.data;
    },

    deleteCannedResponse: async (responseId: string): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/admin/support/canned-responses/${responseId}`);
      return response.data;
    },
  },
};
