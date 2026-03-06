"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DeadlineExtensionsPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [bounty, setBounty] = useState<any>(null);
  const [extensions, setExtensions] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Form state
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [requestedDeadline, setRequestedDeadline] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Fetch bounty
      const bountyRes = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bountyData = await bountyRes.json();
      setBounty(bountyData);

      // Fetch extensions
      const extRes = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/extension-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const extData = await extRes.json();
      setExtensions(extData.extension_requests || []);

      // Fetch milestones if bounty has them
      if (bountyData.has_milestones) {
        const milestonesRes = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/milestones`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const milestonesData = await milestonesRes.json();
        setMilestones(milestonesData.milestones || []);
      }
    } catch (error) {
      showNotification("error", "Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExtension = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reason.length < 20) {
      showNotification("error", "Invalid Reason", "Reason must be at least 20 characters");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/request-extension`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          milestone_id: selectedMilestone || undefined,
          requested_deadline: requestedDeadline,
          reason
        })
      });

      if (response.ok) {
        showNotification("success", "Request Sent!", "Your extension request has been submitted");
        setShowRequestForm(false);
        setSelectedMilestone("");
        setRequestedDeadline("");
        setReason("");
        fetchData();
      } else {
        const error = await response.json();
        showNotification("error", "Failed", error.detail || "Failed to submit request");
      }
    } catch (error) {
      showNotification("error", "Error", "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/extension-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          response_message: "Extension approved"
        })
      });

      if (response.ok) {
        showNotification("success", "Approved!", "Extension request approved");
        fetchData();
      }
    } catch (error) {
      showNotification("error", "Error", "Failed to approve request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/extension-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          response_message: "Extension rejected"
        })
      });

      if (response.ok) {
        showNotification("info", "Rejected", "Extension request rejected");
        fetchData();
      }
    } catch (error) {
      showNotification("error", "Error", "Failed to reject request");
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Navigation */}
      <nav className="border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link href={`/bounties/${params.id}`} className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition">
            <span className="text-lg sm:text-xl">←</span>
            <span className="font-semibold text-sm sm:text-base">Back to Bounty</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
              Deadline Extensions
            </h1>
            <p className="text-sm sm:text-base text-gray-400">{bounty?.title}</p>
          </div>
          
          {bounty?.claimed_by_id && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold text-sm sm:text-base"
            >
              {showRequestForm ? 'Cancel' : 'Request Extension'}
            </button>
          )}
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <form onSubmit={handleRequestExtension} className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Request Deadline Extension</h2>
            
            {bounty?.has_milestones && milestones.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  Milestone (Optional)
                </label>
                <select
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Entire Bounty</option>
                  {milestones.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-white mb-2">
                New Deadline *
              </label>
              <input
                type="date"
                value={requestedDeadline}
                onChange={(e) => setRequestedDeadline(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-white mb-2">
                Reason * (min 20 characters)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                minLength={20}
                rows={4}
                placeholder="Explain why you need more time..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {reason.length}/20 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || reason.length < 20}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}

        {/* Extensions List */}
        <div className="space-y-4">
          {extensions.length === 0 ? (
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8 sm:p-12 text-center">
              <div className="text-4xl sm:text-6xl mb-4">📅</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Extension Requests</h3>
              <p className="text-sm sm:text-base text-gray-400">
                No deadline extension requests have been made yet
              </p>
            </div>
          ) : (
            extensions.map((ext) => (
              <div key={ext.id} className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(ext.status)}`}>
                        {ext.status}
                      </span>
                      {ext.milestone_id && (
                        <span className="text-xs text-gray-400">
                          Milestone Extension
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Requested: {new Date(ext.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Current Deadline</div>
                    <div className="text-sm font-semibold text-white">
                      {new Date(ext.current_deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Requested Deadline</div>
                    <div className="text-sm font-semibold text-orange-400">
                      {new Date(ext.requested_deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-gray-500 mb-2">Reason</div>
                  <p className="text-sm text-white">{ext.reason}</p>
                </div>

                {ext.response_message && (
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-500 mb-2">Response</div>
                    <p className="text-sm text-white">{ext.response_message}</p>
                  </div>
                )}

                {ext.status === 'pending' && bounty?.poster_id && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => handleApprove(ext.id)}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(ext.id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
