import apiClient from './client';

export interface UnifiedMessage {
  id: string;
  type: 'bounty_chat' | 'support' | 'system' | 'review' | 'request';
  from_user_id: string | null;
  from_username: string;
  from_avatar: string | null;
  subject: string;
  preview: string;
  content: string;
  related_id: string | null;
  related_title: string | null;
  is_read: boolean;
  attachments?: MessageAttachment[];
  created_at: string;
  updated_at: string;
}

export interface MessageAttachment {
  id: string;
  file_type: 'voice' | 'image' | 'document';
  file_url: string;
  file_name: string;
  file_size: number;
  duration?: number; // For voice notes
  created_at: string;
}

export interface MessagesInboxResponse {
  data: UnifiedMessage[];
  total: number;
  unread_count: number;
  page: number;
  limit: number;
}

export interface UnreadCountResponse {
  total: number;
  by_type: {
    bounty_chat: number;
    support: number;
    system: number;
    review: number;
    request: number;
  };
}

export const messagesApi = {
  // Get unified inbox
  getInbox: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    unread_only?: boolean;
  }): Promise<MessagesInboxResponse> => {
    const response = await apiClient.get('/messages/inbox', { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<any> => {
    const response = await apiClient.post(`/messages/${messageId}/mark-read`);
    return response.data.data;
  },

  // Mark all as read
  markAllAsRead: async (type?: string): Promise<any> => {
    const response = await apiClient.post('/messages/mark-all-read', 
      type ? { type } : {}
    );
    return response.data.data;
  },

  // Reply to message with text only
  replyText: async (messageId: string, content: string): Promise<any> => {
    const response = await apiClient.post(`/messages/${messageId}/reply`, null, {
      params: { content }
    });
    return response.data.data;
  },

  // Reply with image
  replyWithImage: async (messageId: string, image: File, caption?: string): Promise<any> => {
    const formData = new FormData();
    formData.append('image', image);
    if (caption) formData.append('caption', caption);

    const response = await apiClient.post(`/messages/${messageId}/reply/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Reply with voice note
  replyWithVoice: async (messageId: string, voice: Blob, duration?: number): Promise<any> => {
    const formData = new FormData();
    formData.append('voice', voice);
    if (duration) formData.append('duration', duration.toString());

    const response = await apiClient.post(`/messages/${messageId}/reply/voice`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // Reply with multiple attachments (text + images/voice)
  reply: async (messageId: string, content: string, attachments?: File[]): Promise<any> => {
    // If no attachments, just send text
    if (!attachments || attachments.length === 0) {
      return messagesApi.replyText(messageId, content);
    }

    // Send text first if provided
    if (content.trim()) {
      await messagesApi.replyText(messageId, content);
    }

    // Then send each attachment separately
    for (const file of attachments) {
      if (file.type.startsWith('audio/')) {
        // Voice note
        await messagesApi.replyWithVoice(messageId, file);
      } else if (file.type.startsWith('image/')) {
        // Image
        await messagesApi.replyWithImage(messageId, file);
      }
    }

    return { success: true };
  }
};
