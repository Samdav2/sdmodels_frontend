"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'resolved' | 'all'>('active');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [tickets, setTickets] = useState([
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
          text: "Hi, I tried to purchase a 3D model but my payment failed. The money was deducted from my account but I didn't receive the model.",
          time: "10:30 AM",
          attachments: ["screenshot.png"],
        },
        {
          id: 2,
          sender: "admin",
          text: "Hello Alex! I'm sorry to hear about this issue. Let me check your transaction details. Can you provide the transaction ID?",
          time: "10:35 AM",
          attachments: [],
        },
        {
          id: 3,
          sender: "user",
          text: "Sure, the transaction ID is TXN-2024-001234",
          time: "10:37 AM",
          attachments: [],
        },
      ],
    },
    {
      id: 2,
      user: "Sarah Miller",
      userAvatar: "🚀",
      email: "sarah@example.com",
      subject: "Model Download Problem",
      status: "pending",
      priority: "medium",
      category: "Technical",
      createdDate: "2024-02-16 09:15",
      lastUpdate: "1 hour ago",
      assignedTo: "Unassigned",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "I purchased a model yesterday but the download link is not working. It shows 404 error.",
          time: "09:15 AM",
          attachments: [],
        },
      ],
    },
    {
      id: 3,
      user: "Mike Johnson",
      userAvatar: "💎",
      email: "mike@example.com",
      subject: "Account Verification Request",
      status: "active",
      priority: "low",
      category: "Account",
      createdDate: "2024-02-16 08:00",
      lastUpdate: "3 hours ago",
      assignedTo: "Support Team",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "I want to become a verified creator. I have uploaded 5 models with good ratings. How do I apply?",
          time: "08:00 AM",
          attachments: [],
        },
        {
          id: 2,
          sender: "admin",
          text: "Great to hear! I'll review your account and get back to you within 24 hours.",
          time: "08:30 AM",
          attachments: [],
        },
      ],
    },
    {
      id: 4,
      user: "Emma Davis",
      userAvatar: "👩‍🎨",
      email: "emma@example.com",
      subject: "Refund Request",
      status: "resolved",
      priority: "high",
      category: "Refund",
      createdDate: "2024-02-15 14:20",
      lastUpdate: "1 day ago",
      assignedTo: "Finance Team",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "The model I purchased doesn't match the description. I'd like a refund.",
          time: "02:20 PM",
          attachments: [],
        },
        {
          id: 2,
          sender: "admin",
          text: "I understand your concern. I've processed your refund. You should see it in 3-5 business days.",
          time: "02:45 PM",
          attachments: [],
        },
        {
          id: 3,
          sender: "user",
          text: "Thank you for the quick response!",
          time: "03:00 PM",
          attachments: [],
        },
      ],
    },
  ]);

  const stats = {
    totalTickets: tickets.length,
    activeTickets: tickets.filter(t => t.status === 'active').length,
    pendingTickets: tickets.filter(t => t.status === 'pending').length,
    resolvedToday: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: "2.5 min",
    satisfactionRate: "98%",
  };

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedTicket) return;

    const newMessage = {
      id: (selectedTicketData?.messages.length || 0) + 1,
      sender: "admin",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [],
    };

    setTickets(tickets.map(ticket => {
      if (ticket.id === selectedTicket) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastUpdate: "Just now",
        };
      }
      return ticket;
    }));

    setMessageText("");
  };

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
  };

  const handleAssign = (ticketId: number, assignee: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, assignedTo: assignee } : ticket
    ));
  };

  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  }).filter(t =>
    t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Support Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">🎫</div>
          <div className="text-2xl font-black text-white">{stats.totalTickets}</div>
          <div className="text-xs text-gray-400">Total Tickets</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-blue-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-2xl font-black text-blue-400">{stats.activeTickets}</div>
          <div className="text-xs text-gray-400">Active Chats</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-black text-yellow-400">{stats.pendingTickets}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-black text-green-400">{stats.resolvedToday}</div>
          <div className="text-xs text-gray-400">Resolved Today</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-purple-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-black text-purple-400">{stats.avgResponseTime}</div>
          <div className="text-xs text-gray-400">Avg Response</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-pink-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">😊</div>
          <div className="text-2xl font-black text-pink-400">{stats.satisfactionRate}</div>
          <div className="text-xs text-gray-400">Satisfaction</div>
        </div>
      </div>

      {/* Main Support Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left - Ticket List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>

          {/* Tabs */}
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'active'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                💬 Active ({stats.activeTickets})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⏳ Pending ({stats.pendingTickets})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'resolved'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✅ Resolved
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📋 All
              </button>
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`bg-slate-900/70 backdrop-blur-xl border-2 rounded-xl p-4 cursor-pointer transition ${
                  selectedTicket === ticket.id
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'border-yellow-600/30 hover:border-yellow-500/50'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {ticket.userAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold text-sm truncate">{ticket.user}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        ticket.priority === 'high'
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                          : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mb-1 truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-slate-800 rounded">{ticket.category}</span>
                      <span>•</span>
                      <span>{ticket.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded font-bold ${
                    ticket.status === 'active'
                      ? 'bg-blue-500/20 text-blue-400'
                      : ticket.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status === 'active' ? '💬 Active' : ticket.status === 'pending' ? '⏳ Pending' : '✅ Resolved'}
                  </span>
                  <span className="text-gray-500">{ticket.messages.length} msgs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat Interface */}
        <div className="lg:col-span-2">
          {selectedTicketData ? (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 border-b-2 border-yellow-600/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {selectedTicketData.userAvatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{selectedTicketData.user}</h3>
                      <p className="text-gray-400 text-sm mb-1">{selectedTicketData.email}</p>
                      <p className="text-gray-300 text-sm font-semibold">{selectedTicketData.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTicketData.priority === 'high'
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                        : selectedTicketData.priority === 'medium'
                        ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                        : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                    }`}>
                      {selectedTicketData.priority} priority
                    </span>
                  </div>
                </div>

                {/* Ticket Actions */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedTicketData.status}
                    onChange={(e) => handleStatusChange(selectedTicketData.id, e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-semibold focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="active">💬 Active</option>
                    <option value="resolved">✅ Resolved</option>
                  </select>

                  <select
                    value={selectedTicketData.assignedTo}
                    onChange={(e) => handleAssign(selectedTicketData.id, e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-semibold focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Admin Team">Admin Team</option>
                    <option value="Support Team">Support Team</option>
                    <option value="Finance Team">Finance Team</option>
                    <option value="Technical Team">Technical Team</option>
                  </select>

                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition">
                    📧 Email User
                  </button>

                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-sm transition">
                    📋 View History
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto bg-slate-950/50">
                {selectedTicketData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.sender === 'admin'
                        ? 'bg-gradient-to-r from-yellow-600 to-red-600'
                        : 'bg-slate-800 border border-slate-700'
                    } rounded-2xl p-4`}>
                      <p className="text-white text-sm mb-2">{message.text}</p>
                      {message.attachments.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="px-3 py-1 bg-black/30 rounded-lg text-xs text-white">
                              📎 {attachment}
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="text-xs text-gray-300 opacity-70">{message.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t-2 border-yellow-600/30 bg-slate-900/80">
                <div className="flex gap-3 mb-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 transition text-sm font-semibold">
                      📎 Attach
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 transition text-sm font-semibold">
                      📝 Template
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 transition text-sm font-semibold">
                      😊 Emoji
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-bold hover:from-yellow-500 hover:to-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-12 text-center h-full flex items-center justify-center">
              <div>
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Ticket</h3>
                <p className="text-gray-400">Choose a support ticket from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Response Templates */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6 mt-6">
        <h3 className="text-xl font-black text-white mb-4">⚡ Quick Response Templates</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Payment Issue", text: "I'm looking into your payment issue. Can you provide the transaction ID?" },
            { title: "Download Problem", text: "I'll send you a new download link right away. Please check your email." },
            { title: "Refund Approved", text: "Your refund has been approved and will be processed within 3-5 business days." },
            { title: "Account Verified", text: "Congratulations! Your account has been verified. You now have creator status." },
            { title: "Technical Issue", text: "Our technical team is investigating this issue. We'll update you within 24 hours." },
            { title: "Thank You", text: "Thank you for contacting us! Is there anything else I can help you with?" },
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => setMessageText(template.text)}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left border border-slate-700 hover:border-yellow-500/50"
            >
              <div className="text-white font-bold text-sm mb-1">{template.title}</div>
              <div className="text-gray-400 text-xs line-clamp-2">{template.text}</div>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
