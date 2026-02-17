/**
 * Support API functions
 */

import apiClient from './client';
import { ApiResponse } from './types';

export interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'payment' | 'technical' | 'account' | 'general';
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  assigned_to?: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender: 'user' | 'support';
  text: string;
  created_at: string;
  attachments?: string[];
}

export interface CreateTicketData {
  title: string;
  category: string;
  priority: string;
  description: string;
}

export interface SendMessageData {
  ticket_id: string;
  text: string;
  attachments?: File[];
}

export const supportApi = {
  // Get all tickets for current user
  getTickets: async (): Promise<SupportTicket[]> => {
    const response = await apiClient.get<ApiResponse<SupportTicket[]>>('/support/tickets');
    return response.data.data || [];
  },

  // Get single ticket
  getTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await apiClient.get<ApiResponse<SupportTicket>>(`/support/tickets/${ticketId}`);
    return response.data.data;
  },

  // Create new ticket
  createTicket: async (data: CreateTicketData): Promise<SupportTicket> => {
    const response = await apiClient.post<ApiResponse<SupportTicket>>('/support/tickets', data);
    return response.data.data;
  },

  // Get messages for a ticket
  getTicketMessages: async (ticketId: string): Promise<SupportMessage[]> => {
    const response = await apiClient.get<ApiResponse<SupportMessage[]>>(`/support/tickets/${ticketId}/messages`);
    return response.data.data || [];
  },

  // Send message to ticket
  sendMessage: async (data: SendMessageData): Promise<SupportMessage> => {
    const formData = new FormData();
    formData.append('text', data.text);
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.post<ApiResponse<SupportMessage>>(
      `/support/tickets/${data.ticket_id}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Close ticket
  closeTicket: async (ticketId: string): Promise<void> => {
    await apiClient.patch(`/support/tickets/${ticketId}/close`);
  },

  // Reopen ticket
  reopenTicket: async (ticketId: string): Promise<void> => {
    await apiClient.patch(`/support/tickets/${ticketId}/reopen`);
  },

  // Get FAQs
  getFAQs: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/support/faqs');
    return response.data.data || [];
  },
};
