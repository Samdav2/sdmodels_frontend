"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMyChats,
  getBountyMessages,
  sendTextMessage,
  sendImageMessage,
  sendVoiceMessage,
  markMessagesAsRead,
  updateMessage,
  deleteMessage,
  ChatMessage,
  BountyChat,
} from "@/lib/api/bountyChat";
import { getBountyById } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import VoiceRecorderModal from "@/components/VoiceRecorderModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function BountyChatPage() {
  const params = useParams();
  const router = useRouter();
  const urlBountyId = params.id as string | undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const previousMessageCount = useRef(0);

  // State
  const [chats, setChats] = useState<BountyChat[]>([]);
  const [activeChat, setActiveChat] = useState<BountyChat | null>(null);
  const [activeBounty, setActiveBounty] = useState<any>(null);
  const [activeBountyId, setActiveBountyId] = useState<string | undefined>(urlBountyId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterByBounty, setFilterByBounty] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; messageId: string | null }>({
    isOpen: false,
    messageId: null
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  // Get current user ID
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  // Load all chats
  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Sync activeBountyId with URL parameter on initial load
  useEffect(() => {
    if (urlBountyId && urlBountyId !== 'null' && urlBountyId !== 'undefined') {
      console.log('[Chat] Setting bountyId from URL:', urlBountyId);
      setActiveBountyId(urlBountyId);
    }
  }, [urlBountyId]);

  // Load messages for active bounty
  useEffect(() => {
    console.log('[Chat] useEffect triggered - activeBountyId:', activeBountyId, 'currentUserId:', currentUserId);
    
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      console.log('[Chat] No valid bountyId, skipping load');
      setLoading(false); // Important: set loading to false so UI shows properly
      return;
    }
    
    if (!currentUserId) {
      console.log('[Chat] No currentUserId, skipping load');
      setLoading(false);
      return;
    }
    
    console.log('[Chat] Loading data for bounty:', activeBountyId);
    
    // Load bounty data (only once, not on polling)
    const fetchBountyData = async () => {
      try {
        const bounty = await getBountyById(activeBountyId);
        setActiveBounty(bounty);
        
        // Find the active chat
        const chat = chats.find(c => c.bounty_id === activeBountyId);
        setActiveChat(chat || null);
      } catch (error) {
        console.error("Failed to load bounty:", error);
        showNotification("error", "Error", "Failed to load bounty details");
      }
    };
    
    // Load messages
    const fetchMessages = async (isPolling = false) => {
      // Only show loading spinner on initial load, not on polling
      if (!isPolling) {
        setLoading(true);
      }
      
      try {
        const data = await getBountyMessages(activeBountyId, { 
          limit: 100,
          filter_by_bounty: filterByBounty
        });
        setMessages(data.messages || []);
        
        const unreadIds = data.messages
          ?.filter((m: ChatMessage) => !m.is_read && m.sender_id !== currentUserId)
          .map((m: ChatMessage) => m.id) || [];
        
        if (unreadIds.length > 0) {
          await markMessagesAsRead(activeBountyId, unreadIds);
        }
        
        // Mark initial load as complete after first successful fetch
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        if (!isPolling) {
          showNotification("error", "Error", "Failed to load messages");
        }
      } finally {
        if (!isPolling) {
          setLoading(false);
        }
      }
    };
    
    // Initial load
    fetchBountyData();
    fetchMessages(false);
    
    // Poll every 5 seconds for new messages
    const interval = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(interval);
  }, [activeBountyId, currentUserId, filterByBounty, chats]);  // Re-load when filter changes

  const loadChats = async () => {
    try {
      const data = await getMyChats();
      console.log('[Chat] Loaded chats from backend:', data.chats);
      
      // Filter out chats with null bounty_id (backend bug)
      const validChats = (data.chats || []).filter((chat: BountyChat) => {
        if (!chat.bounty_id || chat.bounty_id === 'null') {
          console.warn('[Chat] Skipping chat with null bounty_id:', chat);
          return false;
        }
        return true;
      });
      
      const invalidCount = (data.chats || []).length - validChats.length;
      if (invalidCount > 0) {
        showNotification(
          "warning", 
          "Some Chats Unavailable", 
          `${invalidCount} chat(s) have data issues and cannot be displayed. Please contact support.`
        );
      }
      
      setChats(validChats);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const loadBountyData = async () => {
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      console.error('[Chat] Cannot load bounty data - invalid bountyId:', activeBountyId);
      return;
    }
    
    try {
      const bounty = await getBountyById(activeBountyId);
      setActiveBounty(bounty);
      
      // Find the active chat
      const chat = chats.find(c => c.bounty_id === activeBountyId);
      setActiveChat(chat || null);
    } catch (error) {
      console.error("Failed to load bounty:", error);
      showNotification("error", "Error", "Failed to load bounty details");
    }
  };

  const loadMessages = async () => {
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      console.error('[Chat] Cannot load messages - invalid bountyId:', activeBountyId);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('[Chat] Fetching messages for bounty:', activeBountyId);
      const data = await getBountyMessages(activeBountyId, { 
        limit: 100,
        filter_by_bounty: filterByBounty  // Apply filter
      });
      console.log('[Chat] Received messages:', data.messages?.length || 0);
      setMessages(data.messages || []);
      
      const unreadIds = data.messages
        ?.filter((m: ChatMessage) => !m.is_read && m.sender_id !== currentUserId)
        .map((m: ChatMessage) => m.id) || [];
      
      if (unreadIds.length > 0) {
        await markMessagesAsRead(activeBountyId, unreadIds);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      showNotification("error", "Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Smart scroll - only scroll on initial load or new messages, not on polling
  useEffect(() => {
    // Only scroll if we have new messages (count increased)
    const hasNewMessages = messages.length > previousMessageCount.current;
    
    if (hasNewMessages && messagesEndRef.current) {
      // Smooth scroll for new messages
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Update the previous count
    previousMessageCount.current = messages.length;
  }, [messages]);

  // Initial scroll to bottom when chat first loads
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0 && messagesEndRef.current) {
      // Instant scroll on initial load
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    }
  }, [messages, activeBountyId]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      showNotification("error", "Error", "Invalid bounty ID");
      return;
    }

    try {
      setSending(true);
      
      if (editingMessage) {
        await updateMessage(editingMessage.id, messageText);
        setEditingMessage(null);
        showNotification("success", "Message Updated", "Your message has been edited");
      } else {
        await sendTextMessage(activeBountyId, {
          message_type: messageText.startsWith('http') ? 'link' : 'text',
          content: messageText,
          reply_to_id: replyTo?.id,
        });
      }

      setMessageText("");
      setReplyTo(null);
      await loadMessages();
      await loadChats(); // Refresh chat list
    } catch (error: any) {
      console.error('[Chat] Send message error:', error);
      showNotification("error", "Error", error.response?.data?.detail || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showNotification("error", "File Too Large", "Image must be less than 10MB");
      return;
    }
    
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      showNotification("error", "Error", "Invalid bounty ID");
      return;
    }

    try {
      setSending(true);
      await sendImageMessage(activeBountyId, { 
        image: file, 
        reply_to_id: replyTo?.id 
      });
      setReplyTo(null);
      await loadMessages();
      await loadChats();
      showNotification("success", "Image Sent", "Your image has been shared");
    } catch (error: any) {
      console.error('[Chat] Send image error:', error);
      showNotification("error", "Error", error.response?.data?.detail || "Failed to send image");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob, duration: number) => {
    if (!activeBountyId || activeBountyId === 'null' || activeBountyId === 'undefined') {
      showNotification("error", "Error", "Invalid bounty ID");
      return;
    }
    
    try {
      setSending(true);
      
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
      
      await sendVoiceMessage(activeBountyId, { 
        voice: audioFile, 
        duration,
        reply_to_id: replyTo?.id 
      });
      
      setReplyTo(null);
      await loadMessages();
      await loadChats();
      showNotification("success", "Voice Note Sent", "Your voice note has been shared");
    } catch (error: any) {
      console.error('[Chat] Send voice error:', error);
      showNotification("error", "Error", error.response?.data?.detail || "Failed to send voice note");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      await loadMessages();
      showNotification("success", "Message Deleted", "The message has been removed");
    } catch (error: any) {
      showNotification("error", "Error", "Failed to delete message");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getOtherUser = (chat: BountyChat) => {
    // Return the other user's info (not current user)
    const isClient = chat.client_id === currentUserId;
    
    // Get username and avatar based on role
    const username = isClient 
      ? (chat.artist_username || 'Artist')
      : (chat.client_username || 'Client');
    
    const avatar = isClient 
      ? chat.artist_avatar
      : chat.client_avatar;
    
    const id = isClient ? chat.artist_id : chat.client_id;
    
    return { username, avatar, id };
  };

  const getCurrentChatOtherUser = () => {
    if (!activeBounty) return null;
    return {
      username: activeBounty.poster_id === currentUserId 
        ? activeBounty.claimed_by_username 
        : activeBounty.poster_username,
      avatar: activeBounty.poster_id === currentUserId 
        ? activeBounty.claimed_by_avatar 
        : activeBounty.poster_avatar,
      id: activeBounty.poster_id === currentUserId 
        ? activeBounty.claimed_by_id 
        : activeBounty.poster_id
    };
  };

  if (loading && !activeBounty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSend={handleVoiceRecording}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, messageId: null })}
        onConfirm={() => {
          if (deleteConfirm.messageId) {
            handleDeleteMessage(deleteConfirm.messageId);
          }
        }}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Header */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur-xl border-b border-orange-500/20 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Back Button - Always visible on mobile */}
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              title="Go back"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Sidebar Toggle - Only on large screens when sidebar exists */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              title="Toggle chat list"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50 flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">SD</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-white truncate">Bounty Chats</h1>
              <p className="text-xs text-slate-400 truncate">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Link
            href="/bounties"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Back to Bounties</span>
            <span className="sm:hidden">Bounties</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat List */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-80 xl:w-96 bg-slate-900/50 border-r border-slate-800 overflow-hidden`}>
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-white font-bold text-lg">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-slate-400 text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <button
                      key={chat.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[Chat] Click - Current activeBountyId:', activeBountyId);
                        console.log('[Chat] Click - Chat object:', chat);
                        console.log('[Chat] Click - Switching to bounty:', chat.bounty_id);
                        
                        if (!chat.bounty_id || chat.bounty_id === 'null') {
                          console.error('[Chat] ERROR: Chat has no bounty_id!', chat);
                          showNotification("error", "Invalid Chat", "This chat has no associated bounty");
                          return;
                        }
                        
                        // Reset scroll tracking for new chat
                        isInitialLoad.current = true;
                        previousMessageCount.current = 0;
                        
                        // Switch to new chat
                        setActiveBountyId(chat.bounty_id);
                        setShowSidebar(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-slate-800/50 transition ${
                        chat.bounty_id === activeBountyId ? 'bg-slate-800/70 border-l-2 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {otherUser.avatar ? (
                            <img 
                              src={otherUser.avatar} 
                              alt={otherUser.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-700">
                              <span className="text-white font-bold text-lg">
                                {otherUser.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold text-sm truncate">
                              {otherUser.username}
                            </h3>
                            {chat.unread_count > 0 && (
                              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                                {chat.unread_count > 9 ? '9+' : chat.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs truncate mb-1">{chat.bounty_title}</p>
                          <p className="text-slate-500 text-xs truncate">{chat.last_message_preview || 'No messages yet'}</p>
                        </div>

                        {/* Time */}
                        <div className="text-xs text-slate-500 whitespace-nowrap">
                          {chat.last_message_at && formatTime(chat.last_message_at)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeBounty ? (
            <>
              {/* Chat Header */}
              <div className="flex-shrink-0 bg-slate-900/70 backdrop-blur-sm border-b border-slate-800 px-2 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* User Avatar */}
                    {(() => {
                      const otherUser = getCurrentChatOtherUser();
                      return otherUser?.avatar ? (
                        <img 
                          src={otherUser.avatar} 
                          alt={otherUser.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-700 flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {otherUser?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      );
                    })()}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-xs sm:text-sm truncate">
                        {activeBounty.poster_id === currentUserId ? activeBounty.claimed_by_username : activeBounty.poster_username}
                      </h3>
                      <p className="text-slate-400 text-xs truncate">{activeBounty.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* Filter Toggle - Hidden on mobile */}
                    <label className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                      <input
                        type="checkbox"
                        checked={filterByBounty}
                        onChange={(e) => setFilterByBounty(e.target.checked)}
                        className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-xs text-slate-300 whitespace-nowrap">This bounty only</span>
                    </label>
                    <Link
                      href={`/bounties/${activeBountyId}`}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-xs font-semibold whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">View Bounty</span>
                      <span className="sm:hidden">View</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No messages yet</h3>
                    <p className="text-slate-400">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.sender_id === currentUserId;
                    const showDate = index === 0 || 
                      formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full text-xs">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        )}

                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            {/* Sender info with avatar for received messages */}
                            {!isOwn && (
                              <div className="flex items-center gap-2 px-2">
                                {message.sender_avatar ? (
                                  <img 
                                    src={message.sender_avatar} 
                                    alt={message.sender_username}
                                    className="w-6 h-6 rounded-full object-cover border border-slate-700"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">
                                      {message.sender_username.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs text-slate-400 font-medium">{message.sender_username}</span>
                              </div>
                            )}

                            {/* Bounty Context Badge */}
                            {message.bounty_id && message.bounty_id !== activeBountyId && (
                              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2 mb-1">
                                <span className="text-sm">📋</span>
                                <span className="text-xs text-purple-300 font-medium">{message.bounty_title || 'Different Bounty'}</span>
                              </div>
                            )}

                            {message.reply_to_message && (
                              <div className="px-3 py-2 bg-slate-800/30 border-l-2 border-orange-500 rounded text-xs text-slate-400 mb-1">
                                <div className="font-semibold">{message.reply_to_message.sender_username}</div>
                                <div className="truncate">{message.reply_to_message.content}</div>
                              </div>
                            )}

                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                message.is_deleted
                                  ? 'bg-slate-800/50 border border-slate-700/50'
                                  : isOwn
                                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                  : 'bg-slate-800 text-white'
                              }`}
                            >
                              {message.is_deleted ? (
                                <div className="flex items-center gap-2 py-1">
                                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  <p className="italic text-slate-500 text-sm">This message was deleted</p>
                                </div>
                              ) : message.message_type === 'image' ? (
                                <div>
                                  <img src={message.file_url} alt="Shared image" className="rounded-lg max-w-full mb-2" />
                                  {message.content && <p>{message.content}</p>}
                                </div>
                              ) : message.message_type === 'voice' ? (
                                <div className="flex items-center gap-3 min-w-[250px]">
                                  <div className="flex items-center gap-2 flex-1">
                                    <div className={`p-2 rounded-full ${isOwn ? 'bg-white/20' : 'bg-orange-500/20'}`}>
                                      <svg className={`w-4 h-4 ${isOwn ? 'text-white' : 'text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                      </svg>
                                    </div>
                                    <audio controls className="flex-1 h-8" style={{ maxWidth: '200px' }}>
                                      <source src={message.file_url} type="audio/webm" />
                                      <source src={message.file_url} type="audio/mpeg" />
                                    </audio>
                                  </div>
                                  {message.voice_duration && (
                                    <span className={`text-xs font-medium ${isOwn ? 'text-white/80' : 'text-slate-400'}`}>
                                      {Math.floor(message.voice_duration / 60)}:{(message.voice_duration % 60).toString().padStart(2, '0')}
                                    </span>
                                  )}
                                </div>
                              ) : message.message_type === 'link' ? (
                                <a href={message.content} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-300">
                                  {message.content}
                                </a>
                              ) : (
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              )}

                              {message.is_edited && !message.is_deleted && (
                                <span className="text-xs opacity-70 ml-2">(edited)</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 px-2">
                              <span className="text-xs text-slate-500">{formatTime(message.created_at)}</span>
                              {isOwn && message.is_read && <span className="text-xs text-green-400">✓✓</span>}
                              {isOwn && !message.is_deleted && message.message_type === 'text' && (
                                <button
                                  onClick={() => {
                                    setEditingMessage(message);
                                    setMessageText(message.content);
                                  }}
                                  className="text-xs text-slate-400 hover:text-white"
                                >
                                  Edit
                                </button>
                              )}
                              {isOwn && !message.is_deleted && (
                                <button 
                                  onClick={() => setDeleteConfirm({ isOpen: true, messageId: message.id })} 
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Delete
                                </button>
                              )}
                              {!isOwn && !message.is_deleted && (
                                <button onClick={() => setReplyTo(message)} className="text-xs text-slate-400 hover:text-white">
                                  Reply
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-2 sm:p-4">
                {(replyTo || editingMessage) && (
                  <div className="mb-2 px-3 sm:px-4 py-2 bg-slate-800/50 rounded-lg flex items-center justify-between">
                    <div className="text-sm flex-1 min-w-0">
                      <span className="text-orange-400 font-semibold text-xs sm:text-sm">
                        {editingMessage ? 'Editing message' : `Replying to ${replyTo?.sender_username}`}
                      </span>
                      <p className="text-slate-400 truncate text-xs sm:text-sm">
                        {editingMessage ? editingMessage.content : replyTo?.content}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReplyTo(null);
                        setEditingMessage(null);
                        setMessageText("");
                      }}
                      className="text-slate-400 hover:text-white ml-2 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-1 sm:gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                    className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50 flex-shrink-0"
                    title="Send image"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowVoiceModal(true)}
                    disabled={sending}
                    className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50 flex-shrink-0"
                    title="Record voice message"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none resize-none"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !messageText.trim()}
                    className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-lg transition disabled:opacity-50 shadow-lg shadow-orange-500/50 flex-shrink-0"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full flex items-center justify-center border-2 border-orange-500/30">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Select a Conversation</h3>
                <p className="text-sm sm:text-base text-slate-400 mb-4">
                  {chats.length > 0 
                    ? "Choose a chat from the sidebar to start messaging" 
                    : "No conversations yet. Start a bounty to begin chatting!"}
                </p>
                {chats.length === 0 && (
                  <Link
                    href="/bounties"
                    className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-lg transition font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/50"
                  >
                    Browse Bounties
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
