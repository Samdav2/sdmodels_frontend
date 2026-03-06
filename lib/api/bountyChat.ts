import apiClient from './client';

export interface BountyChat {
  id: string;
  bounty_id: string;
  client_id: string;
  artist_id: string;
  client_username?: string;
  artist_username?: string;
  client_avatar?: string;  // NEW: Client avatar URL
  artist_avatar?: string;  // NEW: Artist avatar URL
  bounty_title?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message_preview?: string;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  bounty_id?: string;  // NEW: Which bounty this message is about
  bounty_title?: string;  // NEW: Bounty title for display
  message_type: 'text' | 'image' | 'voice' | 'link' | 'file';
  content: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  voice_duration?: number;
  thumbnail_url?: string;
  reply_to_id?: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
  sender_username: string;
  sender_avatar?: string;
  attachments?: any[];
  reply_to_message?: ChatMessage;
}

export interface SendTextMessageData {
  message_type: 'text' | 'link';
  content: string;
  reply_to_id?: string;
}

export interface SendImageData {
  image: File;
  caption?: string;
  reply_to_id?: string;
}

export interface SendVoiceData {
  voice: Blob;
  duration?: number;
  reply_to_id?: string;
}

// Get all user's chats
export const getMyChats = async () => {
  const response = await apiClient.get('/bounty-chat/my-chats');
  return response.data;
};

// Get or create chat for a bounty
export const getBountyChat = async (bountyId: string) => {
  const response = await apiClient.get(`/bounty-chat/bounty/${bountyId}`);
  return response.data;
};

// Get messages for a bounty
export const getBountyMessages = async (bountyId: string, params?: {
  page?: number;
  limit?: number;
  filter_by_bounty?: boolean;  // NEW: Filter by bounty or show all
  before_message_id?: string;
}) => {
  const response = await apiClient.get(`/bounty-chat/bounty/${bountyId}/messages`, { params });
  return response.data;
};

// Send text message
export const sendTextMessage = async (bountyId: string, data: SendTextMessageData) => {
  const response = await apiClient.post(`/bounty-chat/bounty/${bountyId}/messages/text`, data);
  return response.data;
};

// Send image message
export const sendImageMessage = async (bountyId: string, data: SendImageData) => {
  const formData = new FormData();
  formData.append('image', data.image);
  if (data.caption) formData.append('caption', data.caption);
  if (data.reply_to_id) formData.append('reply_to_id', data.reply_to_id);

  const response = await apiClient.post(`/bounty-chat/bounty/${bountyId}/messages/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Send voice note
export const sendVoiceMessage = async (bountyId: string, data: SendVoiceData) => {
  const formData = new FormData();
  formData.append('voice', data.voice);
  if (data.duration) formData.append('duration', data.duration.toString());
  if (data.reply_to_id) formData.append('reply_to_id', data.reply_to_id);

  const response = await apiClient.post(`/bounty-chat/bounty/${bountyId}/messages/voice`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Update message (edit)
export const updateMessage = async (messageId: string, content: string) => {
  const response = await apiClient.put(`/bounty-chat/messages/${messageId}`, { content });
  return response.data;
};

// Delete message
export const deleteMessage = async (messageId: string) => {
  const response = await apiClient.delete(`/bounty-chat/messages/${messageId}`);
  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (bountyId: string, messageIds: string[]) => {
  const response = await apiClient.post(`/bounty-chat/bounty/${bountyId}/mark-read`, {
    message_ids: messageIds
  });
  return response.data;
};

// Get unread count
export const getUnreadCount = async (bountyId: string) => {
  const response = await apiClient.get(`/bounty-chat/bounty/${bountyId}/unread-count`);
  return response.data;
};
