"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { messagesApi, UnifiedMessage } from "@/lib/api/messages";
import LoadingSpinner from "@/components/LoadingSpinner";
import VoiceRecorderModal from "@/components/VoiceRecorderModal";

export default function MessagesPage() {
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<UnifiedMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "bounty_chat" | "support" | "system">("all");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // Load messages
  useEffect(() => {
    loadMessages();
    // Poll every 10 seconds
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesApi.getInbox({
        page: 1,
        limit: 100,
        type: filter
      });
      setMessages(response.data);
      setUnreadCount(response.unread_count);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: UnifiedMessage) => {
    if (message.is_read) return;
    
    try {
      await messagesApi.markAsRead(message.id);
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, is_read: true } : m
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || (!replyText.trim() && attachments.length === 0)) {
      setError('Please enter a message or add an attachment');
      return;
    }
    
    try {
      setSending(true);
      await messagesApi.reply(selectedMessage.id, replyText, attachments);
      setReplyText("");
      setAttachments([]);
      // Reload messages to show reply
      await loadMessages();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleVoiceRecording = (audioBlob: Blob, duration: number) => {
    const file = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
    setAttachments(prev => [...prev, file]);
    setShowVoiceRecorder(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + attachments.length > 5) {
      setError('Maximum 5 attachments allowed');
      return;
    }
    
    setAttachments(prev => [...prev, ...imageFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bounty_chat":
        return "💬";
      case "support":
        return "❓";
      case "system":
        return "🔔";
      case "review":
        return "⭐";
      case "request":
        return "💼";
      default:
        return "📧";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bounty_chat":
        return "text-orange-400 bg-orange-500/20 border-orange-500";
      case "support":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "system":
        return "text-purple-400 bg-purple-500/20 border-purple-500";
      case "review":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "request":
        return "text-green-400 bg-green-500/20 border-green-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">Communication Hub</h1>
          <p className="text-sm sm:text-base text-slate-400">
            {loading ? 'Loading...' : `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Message List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl backdrop-blur overflow-hidden">
            {/* Filters */}
            <div className="p-3 sm:p-4 border-b border-slate-700/50">
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
                {[
                  { value: "all", label: "All", icon: "📬" },
                  { value: "bounty_chat", label: "Chats", icon: "💬" },
                  { value: "system", label: "System", icon: "🔔" },
                  { value: "support", label: "Support", icon: "❓" },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value as any)}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition ${
                      filter === f.value
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="block sm:hidden text-lg">{f.icon}</span>
                    <span className="hidden sm:block">
                      <span className="mr-1">{f.icon}</span>
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message List */}
            <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner />
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-4xl mb-3">📭</div>
                  <p>No messages found</p>
                </div>
              ) : (
                messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message);
                  }}
                  className={`p-3 sm:p-4 border-b border-slate-700/50 cursor-pointer transition ${
                    selectedMessage?.id === message.id
                      ? "bg-orange-500/10 border-l-4 border-l-orange-500"
                      : "hover:bg-slate-800/30"
                  } ${!message.is_read ? "bg-slate-800/20" : ""}`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{getTypeIcon(message.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">
                          {message.from_username}
                        </span>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mb-1 truncate">{message.subject}</div>
                      <div className="text-xs text-slate-500 truncate">{message.preview}</div>
                      <div className="text-xs text-slate-600 mt-1">{formatTime(message.created_at)}</div>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Message Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-700/50 gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {selectedMessage.from_avatar ? (
                      <img 
                        src={selectedMessage.from_avatar}
                        alt={selectedMessage.from_username}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-500/30 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center text-xl sm:text-2xl border border-orange-500/30 flex-shrink-0">
                        {getTypeIcon(selectedMessage.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-400">
                        <span>From: {selectedMessage.from_username}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatTime(selectedMessage.created_at)}</span>
                      </div>
                      {selectedMessage.related_title && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400">
                            Re: {selectedMessage.related_title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedMessage.type)} whitespace-nowrap`}>
                    {selectedMessage.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Message Content */}
                <div className="mb-6 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.content}</p>
                  
                  {/* Attachments */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-3">Attachments:</div>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                            {attachment.file_type === 'voice' ? (
                              <>
                                <span className="text-2xl">🎤</span>
                                <div className="flex-1">
                                  <audio controls className="w-full h-8">
                                    <source src={attachment.file_url} type="audio/webm" />
                                  </audio>
                                  {attachment.duration && (
                                    <div className="text-xs text-slate-500 mt-1">
                                      Duration: {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : attachment.file_type === 'image' ? (
                              <>
                                <span className="text-2xl">🖼️</span>
                                <div className="flex-1">
                                  <img 
                                    src={attachment.file_url} 
                                    alt={attachment.file_name}
                                    className="max-w-full max-h-64 rounded-lg object-contain"
                                  />
                                  <div className="text-xs text-slate-500 mt-1">{attachment.file_name}</div>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">📎</span>
                                <div className="flex-1">
                                  <a 
                                    href={attachment.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-orange-400 hover:text-orange-300 transition"
                                  >
                                    {attachment.file_name}
                                  </a>
                                  <div className="text-xs text-slate-500">
                                    {(attachment.file_size / 1024).toFixed(2)} KB
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section - Only for bounty_chat */}
                {selectedMessage.type === 'bounty_chat' && (
                  <div className="space-y-4">
                    {/* Go to Full Chat Button */}
                    {selectedMessage.related_id && (
                      <Link href={`/bounties/${selectedMessage.related_id}/chat`}>
                        <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition font-bold text-base shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 flex items-center justify-center gap-3 group">
                          <svg className="w-6 h-6 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Go to Full Chat</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </Link>
                    )}
                    
                    {/* Reply Section */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-2 border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white">Quick Reply</h3>
                          <p className="text-xs text-slate-400">Reply here or go to full chat for complete conversation</p>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="mb-4 p-3 sm:p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                        <div className="text-xs text-slate-500 mb-2">Replying to:</div>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                            {selectedMessage.from_username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white mb-1">{selectedMessage.from_username}</div>
                            <div className="text-sm text-slate-300 line-clamp-2">{selectedMessage.preview}</div>
                          </div>
                        </div>
                      </div>

                      {/* Text Area - Larger */}
                      <div className="relative mb-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 bg-slate-950/70 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition resize-none text-sm sm:text-base"
                          placeholder="Type your reply here..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                          {replyText.length} characters
                        </div>
                      </div>

                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                      <div className="mb-4 p-4 bg-slate-950/50 border border-orange-500/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-sm font-semibold text-orange-400">
                            {attachments.length} Attachment{attachments.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {attachments.map((file, index) => (
                            <div 
                              key={index} 
                              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/30 rounded-lg p-3 flex items-center gap-3 hover:border-orange-500/60 transition"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                                {file.type.startsWith('audio/') ? (
                                  <span className="text-2xl">🎤</span>
                                ) : (
                                  <span className="text-2xl">🖼️</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white font-medium truncate max-w-[120px]">
                                  {file.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {(file.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                              <button
                                onClick={() => removeAttachment(index)}
                                className="w-6 h-6 bg-red-500/20 hover:bg-red-500 rounded-full flex items-center justify-center text-red-400 hover:text-white transition group-hover:scale-110"
                                title="Remove attachment"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Attachment Buttons */}
                      <div className="flex gap-2 flex-1">
                        {/* Voice Recording Button */}
                        <button
                          onClick={() => setShowVoiceRecorder(true)}
                          disabled={sending || attachments.length >= 5}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-3 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-xl hover:border-orange-500/50 hover:from-slate-700 hover:to-slate-800 transition text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                          title="Record voice note"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <span className="text-white">Voice</span>
                        </button>

                        {/* Image Upload Button */}
                        <label className="flex-1 sm:flex-none px-3 sm:px-4 py-3 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-xl hover:border-orange-500/50 hover:from-slate-700 hover:to-slate-800 transition text-xs sm:text-sm font-medium flex items-center justify-center gap-2 cursor-pointer group">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-white">Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={sending || attachments.length >= 5}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Send Button */}
                      <button
                        onClick={handleReply}
                        disabled={sending || (!replyText.trim() && attachments.length === 0)}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
                      >
                        {sending ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Send Reply</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Helper Text */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">Max 5 attachments • Images up to 10MB • Voice notes up to 5 minutes</span>
                      <span className="sm:hidden">Max 5 attachments • 10MB each</span>
                    </div>
                  </div>
                </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-8 sm:p-12 backdrop-blur text-center"
              >
                <div className="text-5xl sm:text-6xl mb-4">📬</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Message Selected</h3>
                <p className="text-sm sm:text-base text-slate-400">Select a message from the list to view and reply</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>

    {/* Voice Recorder Modal */}
    {showVoiceRecorder && (
      <VoiceRecorderModal
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onSend={handleVoiceRecording}
      />
    )}
    </ProtectedRoute>
  );
}
