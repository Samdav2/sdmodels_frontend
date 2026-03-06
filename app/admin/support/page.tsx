"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { useAdminSupport } from "@/lib/api/hooks/useAdminSupport";

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'resolved' | 'closed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<'low' | 'medium' | 'high' | 'urgent' | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  
  const { 
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
    exportTickets,
  } = useAdminSupport({
    status: activeTab === 'all' ? undefined : activeTab as 'active' | 'pending' | 'resolved' | 'closed',
    search: searchQuery || undefined,
    priority: priorityFilter || undefined,
    category: categoryFilter || undefined,
  });
  
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [loadingTicketDetails, setLoadingTicketDetails] = useState(false);

  // Fetch full ticket details when a ticket is selected
  const handleSelectTicket = async (ticketId: string) => {
    setSelectedTicket(ticketId);
    setLoadingTicketDetails(true);
    try {
      await fetchTicketDetails(ticketId);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
    } finally {
      setLoadingTicketDetails(false);
    }
  };

  // Auto-refresh ticket messages every 3 seconds when viewing a ticket
  useEffect(() => {
    if (!selectedTicket) return;

    const refreshMessages = async () => {
      try {
        await fetchTicketDetails(selectedTicket);
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
  }, [selectedTicket]);

  if (loading) {
    return (<AdminLayout title="Support Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading support tickets...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Support Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Tickets</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const displayStats = {
    totalTickets: stats.total_tickets || tickets.length,
    activeTickets: stats.active_tickets || tickets.filter(t => t.status === 'active').length,
    pendingTickets: stats.pending_tickets || tickets.filter(t => t.status === 'pending').length,
    resolvedToday: stats.resolved_today || tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: stats.avg_response_time || "N/A",
    satisfactionRate: stats.satisfaction_rate || "N/A",
  };

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedTicket) return;

    try {
      await sendMessage(selectedTicket, messageText);
      setMessageText("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAddInternalNote = async () => {
    if (!internalNoteText.trim() || !selectedTicket) return;

    try {
      await addInternalNote(selectedTicket, internalNoteText);
      setInternalNoteText("");
    } catch (error) {
      console.error('Failed to add internal note:', error);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicketStatus(ticketId, newStatus as 'pending' | 'active' | 'resolved' | 'closed');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (ticketId: string, newPriority: string) => {
    try {
      await updateTicketPriority(ticketId, newPriority as 'low' | 'medium' | 'high' | 'urgent');
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleAssign = async (ticketId: string, assignee: string) => {
    try {
      await assignTicket(ticketId, assignee === 'Unassigned' ? null : assignee);
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleAddTag = async (ticketId: string) => {
    if (!newTag.trim()) return;
    try {
      await manageTags(ticketId, 'add', [newTag.trim()]);
      setNewTag("");
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleRemoveTag = async (ticketId: string, tag: string) => {
    try {
      await manageTags(ticketId, 'remove', [tag]);
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleBulkAction = async (action: 'assign' | 'status' | 'priority', value: string) => {
    if (selectedTickets.length === 0) return;
    try {
      await bulkUpdate(selectedTickets, action, value);
      setSelectedTickets([]);
    } catch (error) {
      console.error('Failed to bulk update:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await exportTickets(format);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleUseCannedResponse = (content: string) => {
    setMessageText(content);
    setShowCannedResponses(false);
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  // Filtering is now done by the hook via params
  const filteredTickets = tickets;

  return (
    <ProtectedRoute requireAdmin={true}>
    <AdminLayout title="Support Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">🎫</div>
          <div className="text-2xl font-black text-white">{displayStats.totalTickets}</div>
          <div className="text-xs text-gray-400">Total Tickets</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-blue-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-2xl font-black text-blue-400">{displayStats.activeTickets}</div>
          <div className="text-xs text-gray-400">Active Chats</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-black text-yellow-400">{displayStats.pendingTickets}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-black text-green-400">{displayStats.resolvedToday}</div>
          <div className="text-xs text-gray-400">Resolved Today</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-purple-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-black text-purple-400">{displayStats.avgResponseTime}</div>
          <div className="text-xs text-gray-400">Avg Response</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-pink-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">😊</div>
          <div className="text-2xl font-black text-pink-400">{displayStats.satisfactionRate}</div>
          <div className="text-xs text-gray-400">Satisfaction</div>
        </div>
      </div>

      {/* Bulk Actions & Export */}
      {selectedTickets.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 border-2 border-yellow-600/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold">{selectedTickets.length} tickets selected</span>
              <button
                onClick={() => setSelectedTickets([])}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                onChange={(e) => e.target.value && handleBulkAction('status', e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="">Bulk Status...</option>
                <option value="pending">Set Pending</option>
                <option value="active">Set Active</option>
                <option value="resolved">Set Resolved</option>
                <option value="closed">Set Closed</option>
              </select>
              <select
                onChange={(e) => e.target.value && handleBulkAction('priority', e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="">Bulk Priority...</option>
                <option value="low">Set Low</option>
                <option value="medium">Set Medium</option>
                <option value="high">Set High</option>
                <option value="urgent">Set Urgent</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Export & Filters Bar */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">All Categories</option>
              <option value="Payment">Payment</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Refund">Refund</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold text-sm transition"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition"
            >
              📄 Export JSON
            </button>
          </div>
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
                💬 Active ({displayStats.activeTickets})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⏳ Pending ({displayStats.pendingTickets})
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
                onClick={() => setActiveTab('closed')}
                className={`py-2 rounded-lg font-bold text-xs transition ${
                  activeTab === 'closed'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔒 Closed
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 rounded-lg font-bold text-xs transition col-span-2 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📋 All Tickets
              </button>
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`bg-slate-900/70 backdrop-blur-xl border-2 rounded-xl p-4 transition ${
                  selectedTicket === ticket.id
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'border-yellow-600/30 hover:border-yellow-500/50'
                } ${ticket.sla_breach ? 'ring-2 ring-red-500/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => toggleTicketSelection(ticket.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 text-yellow-600 focus:ring-yellow-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    onClick={() => handleSelectTicket(ticket.id)}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    {/* Ticket Title/Subject - Most Prominent */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-white font-bold text-sm leading-tight flex-1 line-clamp-2">
                        {ticket.subject}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                        ticket.priority === 'urgent'
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : ticket.priority === 'high'
                          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                          : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {ticket.userAvatar}
                      </div>
                      <span className="text-gray-400 text-xs truncate">{ticket.user}</span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap mb-2">
                      <span className="px-2 py-0.5 bg-slate-800 rounded">{ticket.category}</span>
                      <span>•</span>
                      <span>{ticket.lastUpdate}</span>
                      {ticket.sla_breach && (
                        <>
                          <span>•</span>
                          <span className="text-red-400 font-bold">⚠️ SLA</span>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {ticket.tags.length > 0 && (
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {ticket.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                            🏷️ {tag}
                          </span>
                        ))}
                        {ticket.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-700 text-gray-400 rounded text-xs">
                            +{ticket.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Status and Message Count */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded font-bold ${
                        ticket.status === 'active'
                          ? 'bg-blue-500/20 text-blue-400'
                          : ticket.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : ticket.status === 'resolved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {ticket.status === 'active' ? '💬 Active' : ticket.status === 'pending' ? '⏳ Pending' : ticket.status === 'resolved' ? '✅ Resolved' : '🔒 Closed'}
                      </span>
                      <span className="text-gray-500">{ticket.messages.length} msgs</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat Interface */}
        <div className="lg:col-span-2">
          {loadingTicketDetails ? (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-12 text-center h-full flex items-center justify-center">
              <div>
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-400">Loading ticket details...</p>
              </div>
            </div>
          ) : selectedTicketData ? (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 border-b-2 border-yellow-600/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {selectedTicketData.userAvatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{selectedTicketData.subject}</h3>
                      <p className="text-gray-400 text-sm mb-1">From: {selectedTicketData.user} ({selectedTicketData.email})</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-slate-800 rounded">{selectedTicketData.category}</span>
                        <span>•</span>
                        <span>Created: {selectedTicketData.createdDate}</span>
                      </div>
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
                    <option value="closed">🔒 Closed</option>
                  </select>

                  <select
                    value={selectedTicketData.priority}
                    onChange={(e) => handlePriorityChange(selectedTicketData.id, e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-semibold focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">🚨 Urgent</option>
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

                  <button
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                    className={`px-4 py-2 ${showInternalNotes ? 'bg-purple-600' : 'bg-slate-800'} hover:bg-purple-500 text-white rounded-lg font-semibold text-sm transition`}
                  >
                    🔒 Internal Notes
                  </button>

                  <button
                    onClick={() => setShowCannedResponses(!showCannedResponses)}
                    className={`px-4 py-2 ${showCannedResponses ? 'bg-blue-600' : 'bg-slate-800'} hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition`}
                  >
                    📝 Templates
                  </button>
                </div>

                {/* Tags Management */}
                {selectedTicketData.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {selectedTicketData.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-2">
                        🏷️ {tag}
                        <button
                          onClick={() => handleRemoveTag(selectedTicketData.id, tag)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Tag */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(selectedTicketData.id)}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddTag(selectedTicketData.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto bg-slate-950/50">
                {selectedTicketData.messages && selectedTicketData.messages.length > 0 ? (
                  selectedTicketData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.is_internal
                          ? 'bg-purple-900/50 border-2 border-purple-500/50'
                          : message.sender === 'admin'
                          ? 'bg-gradient-to-r from-yellow-600 to-red-600'
                          : 'bg-slate-800 border border-slate-700'
                      } rounded-2xl p-4`}>
                        {message.is_internal && (
                          <div className="text-xs text-purple-300 font-bold mb-1 flex items-center gap-1">
                            🔒 INTERNAL NOTE - Not visible to user
                          </div>
                        )}
                        <p className="text-white text-sm mb-2">{message.text}</p>
                        {message.attachments && message.attachments.length > 0 && (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-400 text-sm">No messages yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start the conversation below</p>
                  </div>
                )}
              </div>

              {/* Internal Notes Section */}
              {showInternalNotes && (
                <div className="p-6 border-t-2 border-purple-600/30 bg-purple-950/20">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    🔒 Add Internal Note (Admin Only)
                  </h4>
                  <div className="flex gap-3 mb-2">
                    <textarea
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder="Add internal note for team (not visible to user)..."
                      className="flex-1 px-4 py-3 bg-slate-800 border-2 border-purple-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleAddInternalNote}
                    disabled={!internalNoteText.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Internal Note
                  </button>
                </div>
              )}

              {/* Canned Responses Modal */}
              {showCannedResponses && cannedResponses.length > 0 && (
                <div className="p-6 border-t-2 border-blue-600/30 bg-blue-950/20">
                  <h4 className="text-white font-bold mb-3">📝 Quick Response Templates</h4>
                  <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                    {cannedResponses.map((response) => (
                      <button
                        key={response.id}
                        onClick={() => handleUseCannedResponse(response.content)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-left border border-slate-700 hover:border-blue-500/50"
                      >
                        <div className="text-white font-bold text-sm mb-1">{response.title}</div>
                        <div className="text-gray-400 text-xs line-clamp-2">{response.content}</div>
                        {response.shortcut && (
                          <div className="text-blue-400 text-xs mt-1">Shortcut: {response.shortcut}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Message Input */}
              <div className="p-6 border-t-2 border-yellow-600/30 bg-slate-900/80">
                {/* Character Counter & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {messageText.length} / 2000 characters
                    </span>
                    {messageText.length > 1800 && (
                      <span className="text-xs text-yellow-500 font-semibold">
                        ⚠️ Approaching limit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>

                {/* Enhanced Textarea */}
                <div className="relative mb-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => {
                      if (e.target.value.length <= 2000) {
                        setMessageText(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response... (Shift+Enter for new line, Enter to send)"
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none transition-all"
                    rows={4}
                  />
                  {messageText.trim() && (
                    <button
                      onClick={() => setMessageText("")}
                      className="absolute top-2 right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition text-xs"
                      title="Clear message"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Advanced Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-white transition text-sm font-semibold flex items-center gap-1">
                      📎 Attach File
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-white transition text-sm font-semibold flex items-center gap-1">
                      📝 Use Template
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-white transition text-sm font-semibold flex items-center gap-1">
                      😊 Emoji
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-white transition text-sm font-semibold flex items-center gap-1">
                      🔗 Insert Link
                    </button>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-yellow-500/50 hover:text-white transition text-sm font-semibold flex items-center gap-1">
                      💾 Save Draft
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMessageText("")}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-red-500/50 hover:text-red-400 transition text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-lg font-bold hover:from-yellow-500 hover:to-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      <span>Send Message</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-sm">💡</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">Pro Tips:</span> Use templates for common responses • 
                        Attach screenshots for clarity • Save drafts for complex replies • 
                        Press Shift+Enter for new line
                      </p>
                    </div>
                  </div>
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
    </ProtectedRoute>
  );
}
