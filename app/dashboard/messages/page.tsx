"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMessages } from "@/lib/api/hooks/useDashboard";

interface Message {
  id: string;
  type: "request" | "review" | "support";
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  rating?: number;
  model?: string;
}

export default function MessagesPage() {
  const { messages: apiMessages, loading, error, sendReply, markAsRead } = useMessages();
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "request" | "review" | "support">("all");
  const [replyText, setReplyText] = useState("");

  // Use API messages or fallback to empty array
  const messages = apiMessages || [];
  const filteredMessages = filter === "all" ? messages : messages.filter((m: any) => m.type === filter);
  const unreadCount = messages.filter((m: any) => m.unread).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      await sendReply(selectedMessage.id, replyText);
      setReplyText("");
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "request":
        return "💼";
      case "review":
        return "⭐";
      case "support":
        return "❓";
      default:
        return "📧";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "request":
        return "text-orange-400 bg-orange-500/20 border-orange-500";
      case "review":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "support":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
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
                  { value: "request", label: "Requests", icon: "💼" },
                  { value: "review", label: "Reviews", icon: "⭐" },
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
                <div className="p-8 text-center text-slate-400">Loading messages...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No messages found</div>
              ) : (
                filteredMessages.map((message: any) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message.id);
                  }}
                  className={`p-3 sm:p-4 border-b border-slate-700/50 cursor-pointer transition ${
                    selectedMessage?.id === message.id
                      ? "bg-orange-500/10 border-l-4 border-l-orange-500"
                      : "hover:bg-slate-800/30"
                  } ${message.unread ? "bg-slate-800/20" : ""}`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{getTypeIcon(message.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">{message.from}</span>
                        {message.unread && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mb-1 truncate">{message.subject}</div>
                      <div className="text-xs text-slate-500 truncate">{message.preview}</div>
                      <div className="text-xs text-slate-600 mt-1">{message.time}</div>
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center text-xl sm:text-2xl border border-orange-500/30 flex-shrink-0">
                      {getTypeIcon(selectedMessage.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">{selectedMessage.subject}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-400">
                        <span>From: {selectedMessage.from}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{selectedMessage.time}</span>
                      </div>
                      {selectedMessage.model && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400">
                            Re: {selectedMessage.model}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedMessage.type)} whitespace-nowrap`}>
                    {selectedMessage.type}
                  </span>
                </div>

                {/* Rating (for reviews) */}
                {selectedMessage.rating && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-yellow-400">Rating:</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < selectedMessage.rating! ? "text-yellow-400" : "text-slate-600"}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="mb-6 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                  <p className="text-slate-300 leading-relaxed">{selectedMessage.preview}</p>
                </div>

                {/* Reply Section */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition resize-none"
                    placeholder="Type your reply..."
                  />
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                    <button className="px-4 sm:px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm sm:text-base">
                      Save Draft
                    </button>
                    <button
                      onClick={handleReply}
                      className="px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 text-sm sm:text-base"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
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
    </ProtectedRoute>
  );
}
