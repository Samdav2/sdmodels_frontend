"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSupport, useFAQs } from "@/lib/api/hooks/useSupport";
import { supportApi } from "@/lib/api/support";
import Toast, { ToastType } from "@/components/Toast";

export default function SupportPage() {
  const { tickets, loading: ticketsLoading, createTicket } = useSupport();
  const { faqs, loading: faqsLoading } = useFAQs();
  
  const [activeChat, setActiveChat] = useState<'user' | 'admin'>('user');
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! Welcome to SDModels Support. How can I help you today?",
      time: "10:30 AM",
    },
  ]);

  // Create ticket modal state
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState<'Payment' | 'Technical' | 'Account' | 'Refund'>('Technical');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketMessage, setTicketMessage] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  // View ticket modal state
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Ref for messages container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && selectedTicket?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages]);

  // Auto-refresh ticket messages every 3 seconds when viewing a ticket
  useEffect(() => {
    if (!selectedTicket || !showTicketDetails) return;

    const refreshMessages = async () => {
      try {
        const updatedTicket = await supportApi.getTicket(selectedTicket.id);
        setSelectedTicket(updatedTicket);
      } catch (error) {
        console.error('Error refreshing messages:', error);
      }
    };

    // Initial refresh
    refreshMessages();

    // Set up polling interval
    const intervalId = setInterval(refreshMessages, 3000); // Refresh every 3 seconds

    // Cleanup on unmount or when ticket changes
    return () => clearInterval(intervalId);
  }, [selectedTicket?.id, showTicketDetails]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // TODO: Send message to backend via API
    // For now, simulate support response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "support",
        text: "Thank you for your message! Our team is reviewing your request and will respond shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      setToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    try {
      setCreatingTicket(true);
      await createTicket({
        subject: ticketSubject,
        category: ticketCategory,
        priority: ticketPriority,
        message: ticketMessage,
      });

      // Reset form
      setTicketSubject("");
      setTicketCategory('Technical');
      setTicketPriority('medium');
      setTicketMessage("");
      setShowCreateTicket(false);

      setToast({ message: "Ticket created successfully! 🎉", type: "success" });
    } catch (error: any) {
      setToast({ 
        message: error.response?.data?.detail || "Failed to create ticket", 
        type: "error" 
      });
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleViewTicket = async (ticket: any) => {
    try {
      console.log('Fetching ticket details for:', ticket.id);
      // Fetch full ticket details with messages
      const fullTicket = await supportApi.getTicket(ticket.id);
      console.log('Full ticket received:', fullTicket);
      console.log('Messages:', fullTicket.messages);
      setSelectedTicket(fullTicket);
      setShowTicketDetails(true);
    } catch (error: any) {
      console.error('Error loading ticket:', error);
      setToast({ 
        message: error.response?.data?.detail || "Failed to load ticket details", 
        type: "error" 
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const messageContent = replyMessage;
    setReplyMessage(""); // Clear input immediately for better UX

    try {
      setSendingReply(true);
      
      // CRITICAL: Ensure we're using USER token, not admin token
      // Clear any admin session data that might interfere
      if (typeof window !== 'undefined') {
        const adminData = localStorage.getItem('admin_data');
        if (adminData) {
          console.warn('[Support] Detected admin_data in localStorage - this may cause token issues');
          console.warn('[Support] User should be using USER token, not ADMIN token');
        }
      }
      
      // Optimistic update - add message to UI immediately
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        ticket_id: selectedTicket.id,
        sender_id: 'current-user',
        sender_type: 'user' as const,
        content: messageContent,
        attachments: [],
        is_internal: false,
        created_at: new Date().toISOString(),
      };
      
      setSelectedTicket({
        ...selectedTicket,
        messages: [...(selectedTicket.messages || []), optimisticMessage],
      });
      
      console.log('Sending message to ticket:', selectedTicket.id);
      console.log('Using token from localStorage:', localStorage.getItem('access_token') ? 'USER token present' : 'NO USER TOKEN');
      console.log('Admin token present?', localStorage.getItem('admin_access_token') ? 'YES - THIS IS THE PROBLEM!' : 'No');
      
      // Send message to backend
      const newMessage = await supportApi.sendMessage(selectedTicket.id, { 
        content: messageContent 
      });
      
      console.log('Message sent successfully:', newMessage);
      
      // Fetch updated ticket with new messages from backend
      console.log('Fetching updated ticket...');
      const updatedTicket = await supportApi.getTicket(selectedTicket.id);
      
      console.log('Updated ticket received:', updatedTicket);
      console.log('Messages in updated ticket:', updatedTicket.messages);
      
      setSelectedTicket(updatedTicket);
      
      setToast({ message: "Reply sent successfully! 💬", type: "success" });
    } catch (error: any) {
      console.error('Error sending reply:', error);
      console.error('Error response:', error.response?.data);
      setToast({ 
        message: error.response?.data?.detail || "Failed to send reply", 
        type: "error" 
      });
      // Revert optimistic update on error
      setReplyMessage(messageContent);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-1 sm:gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold text-sm sm:text-base">SDModels Support</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/community"
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-xs sm:text-sm font-semibold"
            >
              <span className="hidden sm:inline">👥 Community</span>
              <span className="sm:hidden">👥</span>
            </Link>
            <Link
              href="/marketplace"
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-xs sm:text-sm font-semibold"
            >
              <span className="hidden sm:inline">🛒 Marketplace</span>
              <span className="sm:hidden">🛒</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-orange-900/20">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 sm:mb-4">
            How Can We <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">Help You?</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            24/7 support from our expert team. Average response time: 2 minutes
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition text-sm sm:text-base">
              💬 <span className="hidden sm:inline">Start </span>Live Chat
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 border border-orange-500/30 text-orange-400 rounded-xl font-semibold hover:bg-orange-500/20 transition text-sm sm:text-base">
              📧 <span className="hidden sm:inline">Email </span>Support
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 border border-orange-500/30 text-orange-400 rounded-xl font-semibold hover:bg-orange-500/20 transition text-sm sm:text-base">
              📞 <span className="hidden sm:inline">Schedule </span>Call
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Left - Chat Interface */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Chat Tabs */}
            <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-orange-500/20">
              <button
                onClick={() => setActiveChat('user')}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  activeChat === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">💬 Live Chat</span>
                <span className="sm:hidden">💬 Chat</span>
              </button>
              <button
                onClick={() => setActiveChat('admin')}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  activeChat === 'admin'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">🎫 My Tickets</span>
                <span className="sm:hidden">🎫 Tickets</span>
              </button>
            </div>

            {/* Live Chat */}
            {activeChat === 'user' && (
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                      👨‍💼
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base">Support Team</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto bg-slate-950/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[70%] ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-slate-800 border border-slate-700'
                      } rounded-2xl p-3 sm:p-4`}>
                        <p className="text-white text-xs sm:text-sm mb-1">{message.text}</p>
                        <span className="text-xs text-gray-300 opacity-70">{message.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-slate-700 bg-slate-900/80">
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition text-sm sm:text-base"
                    >
                      <span className="hidden sm:inline">Send</span>
                      <span className="sm:hidden">📤</span>
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-2 sm:mt-3 overflow-x-auto">
                    <button className="px-2 sm:px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-orange-500/50 transition whitespace-nowrap">
                      📎 <span className="hidden sm:inline">Attach File</span>
                    </button>
                    <button className="px-2 sm:px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-orange-500/50 transition whitespace-nowrap">
                      📸 <span className="hidden sm:inline">Screenshot</span>
                    </button>
                    <button className="px-2 sm:px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-orange-500/50 transition whitespace-nowrap">
                      😊 <span className="hidden sm:inline">Emoji</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets */}
            {activeChat === 'admin' && (
              <div className="space-y-4">
                <button 
                  onClick={() => setShowCreateTicket(true)}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition"
                >
                  ➕ Create New Ticket
                </button>
                
                {ticketsLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No tickets yet</div>
                ) : (
                  tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{ticket.subject}</h3>
                        <p className="text-gray-400 text-sm">Last updated: {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'pending'
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                          : ticket.status === 'active'
                          ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/20 border border-green-500/30 text-green-400'
                      }`}>
                        {ticket.status === 'pending' ? '🔵 Pending' : ticket.status === 'active' ? '🟡 Active' : '🟢 Resolved'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === 'high'
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : ticket.priority === 'medium'
                          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                          : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                      }`}>
                        {ticket.priority === 'high' ? '🔴 High' : ticket.priority === 'medium' ? '🟠 Medium' : '⚪ Low'} Priority
                      </span>
                      
                      <button 
                        onClick={() => handleViewTicket(ticket)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right - FAQs & Resources */}
          <div className="lg:col-span-1 space-y-6">
            {/* FAQs */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span>❓</span>
                <span>Frequently Asked</span>
              </h3>
              
              <div className="space-y-3">
                {faqsLoading ? (
                  <div className="text-center py-4 text-slate-400">Loading FAQs...</div>
                ) : faqs.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No FAQs available</div>
                ) : (
                  faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition"
                  >
                    <summary className="text-white font-semibold text-sm">
                      {faq.question}
                    </summary>
                    <p className="text-gray-400 text-sm mt-2">
                      {faq.answer}
                    </p>
                  </details>
                  ))
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">📞 Contact Us</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="text-gray-400">Email</div>
                    <div className="text-white font-semibold">support@sdmodels.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-gray-400">Live Chat</div>
                    <div className="text-green-400 font-semibold">Available 24/7</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <div className="text-gray-400">Response Time</div>
                    <div className="text-white font-semibold">~2 minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">📚 Resources</h3>
              
              <div className="space-y-2">
                <Link
                  href="/docs"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">📖 Documentation</div>
                  <div className="text-gray-400 text-xs">Complete guides & tutorials</div>
                </Link>
                
                <Link
                  href="/learn"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">🎓 Learning Center</div>
                  <div className="text-gray-400 text-xs">Video tutorials & courses</div>
                </Link>
                
                <Link
                  href="/community"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">👥 Community Forum</div>
                  <div className="text-gray-400 text-xs">Ask the community</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* View Ticket Details Modal - Modern Chat Style */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Chat Header - Fixed */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-xl sm:text-2xl backdrop-blur-sm flex-shrink-0">
                  👨‍💼
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-sm sm:text-lg truncate">{selectedTicket.subject}</h2>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                    <span className="truncate">Support Team • #{selectedTicket.ticket_number || selectedTicket.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`hidden sm:inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedTicket.status === 'pending'
                    ? 'bg-blue-500/30 text-blue-100'
                    : selectedTicket.status === 'active'
                    ? 'bg-yellow-500/30 text-yellow-100'
                    : 'bg-green-500/30 text-green-100'
                }`}>
                  {selectedTicket.status === 'pending' ? '⏳ Pending' : selectedTicket.status === 'active' ? '⚡ Active' : '✅ Resolved'}
                </span>
                <button
                  onClick={() => {
                    setShowTicketDetails(false);
                    setReplyMessage("");
                  }}
                  className="text-white/80 hover:text-white transition text-xl sm:text-2xl p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Ticket Info Bar */}
            <div className="bg-slate-800/50 border-b border-slate-700 px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">📁 {selectedTicket.category}</span>
              <span className="hidden sm:inline">•</span>
              <span className={`flex items-center gap-1 ${
                selectedTicket.priority === 'high' ? 'text-red-400' : 
                selectedTicket.priority === 'medium' ? 'text-orange-400' : 'text-gray-400'
              }`}>
                {selectedTicket.priority === 'high' ? '🔴 High' : 
                 selectedTicket.priority === 'medium' ? '🟠 Medium' : '⚪ Low'}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">📅 {new Date(selectedTicket.created_at).toLocaleDateString()}</span>
            </div>

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                <>
                  {selectedTicket.messages.map((msg: any, index: number) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className={`max-w-[85%] sm:max-w-[75%] ${
                        msg.sender_type === 'user'
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20'
                          : 'bg-slate-800 border border-slate-700 shadow-lg'
                      } rounded-2xl p-3 sm:p-4 transform transition-all hover:scale-[1.02]`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base sm:text-lg">
                            {msg.sender_type === 'user' ? '👤' : '👨‍💼'}
                          </span>
                          <span className={`text-xs font-semibold ${
                            msg.sender_type === 'user' ? 'text-white/90' : 'text-orange-400'
                          }`}>
                            {msg.sender_type === 'user' ? 'You' : 'Support Team'}
                          </span>
                        </div>
                        <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`text-xs mt-2 flex items-center gap-1 ${
                          msg.sender_type === 'user' ? 'text-white/60' : 'text-gray-500'
                        }`}>
                          <span>🕐</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <div className="text-5xl sm:text-6xl mb-4 animate-bounce">💬</div>
                    <p className="text-gray-400 text-base sm:text-lg font-semibold">No messages yet</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">Our support team will respond soon!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Input - Fixed at Bottom */}
            {selectedTicket.status !== 'resolved' ? (
              <div className="bg-slate-900 border-t border-slate-700 p-3 sm:p-4 shadow-2xl">
                <div className="flex gap-2 sm:gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder="Type your message..."
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none resize-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="px-4 sm:px-6 py-2 sm:py-3 h-auto bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:scale-105 active:scale-95"
                  >
                    {sendingReply ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="hidden sm:inline">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Send</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 hidden sm:block">💡 Press Enter to send, Shift+Enter for new line</p>
              </div>
            ) : (
              <div className="bg-green-500/10 border-t border-green-500/30 p-3 sm:p-4 text-center">
                <p className="text-green-400 font-semibold text-sm sm:text-base">✅ This ticket has been resolved</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">If you need further assistance, please create a new ticket</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-b border-blue-500/30 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create Support Ticket</h2>
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="text-gray-400 hover:text-white transition text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as 'Payment' | 'Technical' | 'Account' | 'Refund')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Technical">Technical Issue</option>
                  <option value="Payment">Payment Issue</option>
                  <option value="Account">Account Issue</option>
                  <option value="Refund">Refund Request</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Priority <span className="text-red-400">*</span>
                </label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Standard issue</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                  💡 <strong>Tip:</strong> Include as much detail as possible to help us resolve your issue faster. Screenshots and error messages are very helpful!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex gap-3">
              <button
                onClick={() => setShowCreateTicket(false)}
                disabled={creatingTicket}
                className="flex-1 px-6 py-3 bg-slate-800 border border-slate-700 text-gray-400 rounded-xl font-semibold hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={creatingTicket || !ticketSubject.trim() || !ticketMessage.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingTicket ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
