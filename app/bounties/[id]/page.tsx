"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty } from "@/lib/api/hooks/useBounties";
import { applyToBounty } from "@/lib/api/bounties";
import { getUnreadCount } from "@/lib/api/bountyChat";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as string; // UUID string
  
  const { bounty, loading, error } = useBounty(bountyId);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  
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
  
  const [applicationData, setApplicationData] = useState({
    proposal: "",
    estimated_delivery: "",
    portfolio_links: [""],
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Get current user ID
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  // Fetch unread count for claimed bounties
  useEffect(() => {
    if (bounty && bounty.status !== "open" && bounty.status !== "cancelled" && currentUserId) {
      // Only fetch unread count if user is involved (client or artist)
      const isInvolved = bounty.poster_id === currentUserId || bounty.claimed_by_id === currentUserId;
      if (isInvolved) {
        fetchUnreadCount();
        // Poll every 10 seconds
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [bounty, currentUserId]);

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount(bountyId);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleAddPortfolioLink = () => {
    setApplicationData(prev => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, ""]
    }));
  };

  const handleRemovePortfolioLink = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index)
    }));
  };

  const handlePortfolioLinkChange = (index: number, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.map((link, i) => i === index ? value : link)
    }));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationData.proposal || !applicationData.estimated_delivery) {
      setApplyError("Please fill in all required fields");
      return;
    }

    // Validate proposal length (backend requires minimum 50 characters)
    if (applicationData.proposal.length < 50) {
      setApplyError("Proposal must be at least 50 characters long");
      return;
    }

    const filteredLinks = applicationData.portfolio_links.filter(link => link.trim() !== "");

    try {
      setApplying(true);
      setApplyError(null);

      await applyToBounty(bountyId, {
        proposal: applicationData.proposal,
        estimated_delivery: applicationData.estimated_delivery,
        portfolio_links: filteredLinks,
      });

      setShowApplyModal(false);
      showNotification("success", "Application Submitted!", "Your application has been sent to the client.");
      setTimeout(() => router.push("/bounties"), 1500);
    } catch (err: any) {
      setApplyError(err.response?.data?.detail || err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "claimed":
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "completed":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "cancelled":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-slate-400 bg-slate-500/20 border-slate-500";
      case "in_progress":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "submitted":
        return "text-purple-400 bg-purple-500/20 border-purple-500";
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "cancelled":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!bounty) return <ErrorMessage error="Bounty not found" />;

  const completedMilestones = bounty.milestones?.filter((m: any) => m.status === 'completed').length || 0;
  const totalMilestones = bounty.milestones?.length || 0;

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
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Bounty Details
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <Link href="/bounties" className="flex-1 sm:flex-none text-center text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Back to Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-2xl p-4 sm:p-8 backdrop-blur mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
            <div className="flex-1 w-full">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 break-words">
                {bounty.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-xs sm:text-sm">
                  {bounty.category}
                </span>
                <span className={`px-2 sm:px-3 py-1 sm:py-1.5 border rounded-lg text-xs sm:text-sm font-medium ${getDifficultyColor(bounty.difficulty)}`}>
                  {bounty.difficulty?.toUpperCase()}
                </span>
                <span className={`px-2 sm:px-3 py-1 sm:py-1.5 border rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(bounty.status)}`}>
                  {bounty.status?.toUpperCase().replace('_', ' ')}
                </span>
                {bounty.has_milestones && (
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500/20 border border-purple-500 text-purple-400 rounded-lg text-xs sm:text-sm font-medium">
                    🎯 MILESTONES
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-3xl sm:text-5xl font-black text-orange-400 mb-2">
                ${bounty.budget}
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                Deadline: {new Date(bounty.deadline).toLocaleDateString()}
              </div>
              {bounty.max_revisions !== undefined && (
                <div className="text-xs sm:text-sm text-slate-400 mt-1">
                  Revisions: {bounty.revision_count || 0}/{bounty.max_revisions}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 border-t border-slate-700/50 pt-3 sm:pt-4">
            <div>
              Posted by <span className="text-white font-medium">{bounty.poster_username}</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div>{new Date(bounty.created_at).toLocaleDateString()}</div>
            {bounty.claimed_by_username && (
              <>
                <div className="hidden sm:block">•</div>
                <div className="w-full sm:w-auto">
                  Claimed by <span className="text-orange-400 font-medium">{bounty.claimed_by_username}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Milestones Progress (if applicable) */}
        {bounty.has_milestones && bounty.milestones && bounty.milestones.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <span>🎯</span>
                <span>Project Milestones</span>
              </h3>
              <Link
                href={`/bounties/${bountyId}/milestones`}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition font-semibold text-xs sm:text-sm"
              >
                View All
              </Link>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs sm:text-sm text-slate-300 mb-2">
                <span>Progress</span>
                <span>{completedMilestones} of {totalMilestones} completed</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 sm:h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all"
                  style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {bounty.milestones.slice(0, 3).map((milestone: any, index: number) => (
                <div key={milestone.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-400 font-bold text-xs sm:text-sm">#{index + 1}</span>
                        <span className="text-white font-semibold text-xs sm:text-sm truncate">{milestone.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>${milestone.amount}</span>
                        <span>•</span>
                        <span>{new Date(milestone.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 border rounded text-xs font-medium whitespace-nowrap ${getMilestoneStatusColor(milestone.status)}`}>
                      {milestone.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {bounty.milestones.length > 3 && (
              <div className="text-center mt-3 sm:mt-4">
                <Link
                  href={`/bounties/${bountyId}/milestones`}
                  className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-semibold"
                >
                  View all {bounty.milestones.length} milestones →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions (for claimed bounties) */}
        {bounty.status !== "open" && bounty.status !== "cancelled" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Chat Button - Always first for claimed bounties */}
            <Link
              href={`/bounties/${bountyId}/chat`}
              className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500/20 to-red-600/20 border-2 border-orange-500/50 text-orange-400 rounded-xl hover:from-orange-500/30 hover:to-red-600/30 transition font-semibold text-center text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span className="text-xl">💬</span>
              <span>Chat with {bounty.poster_id === currentUserId ? bounty.claimed_by_username : bounty.poster_username}</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {bounty.has_milestones && (
              <Link
                href={`/bounties/${bountyId}/milestones`}
                className="px-4 sm:px-6 py-3 sm:py-4 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-xl hover:bg-purple-500/30 transition font-semibold text-center text-sm sm:text-base"
              >
                📋 Manage Milestones
              </Link>
            )}
            <Link
              href={`/bounties/${bountyId}/extensions`}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/30 transition font-semibold text-center text-sm sm:text-base"
            >
              ⏰ Deadline Extensions
            </Link>
          </div>
        )}

        {/* Description */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Description</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {bounty.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Requirements</h3>
          <ul className="space-y-2">
            {bounty.requirements?.map((req: string, index: number) => (
              <li key={index} className="flex items-start gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                <span className="text-orange-400 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                <span className="break-words">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escrow Info */}
        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
            <span>🔒</span>
            Escrow Protection
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Payment is held securely in escrow until you deliver the work and the buyer approves it. 
            {bounty.has_milestones && " For milestone-based projects, payment is released per milestone completion."}
            {" "}This protects both parties and ensures fair payment. Platform fee: 7.5%
          </p>
        </div>

        {/* Action Button */}
        {bounty.status === "open" && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-base sm:text-lg shadow-lg shadow-orange-500/50"
          >
            Apply for this Bounty
          </button>
        )}

        {bounty.status === "claimed" && bounty.claimed_by_username && (
          <div className="text-center p-4 sm:p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 font-semibold text-sm sm:text-base">
              This bounty has been claimed by {bounty.claimed_by_username}
            </p>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-orange-500 rounded-xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl sm:text-3xl font-black text-white mb-4 sm:mb-6">
              Apply for Bounty
            </h3>

            {applyError && (
              <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm sm:text-base">{applyError}</p>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4 sm:space-y-6">
              {/* Proposal */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Your Proposal <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={applicationData.proposal}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, proposal: e.target.value }))}
                  placeholder="Explain why you're the best fit for this project..."
                  rows={6}
                  minLength={50}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Minimum 50 characters required
                  </p>
                  <p className={`text-xs sm:text-sm font-medium ${
                    applicationData.proposal.length < 50 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {applicationData.proposal.length} / 50
                  </p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Estimated Delivery Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={applicationData.estimated_delivery}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, estimated_delivery: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  max={bounty.deadline}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none transition"
                  required
                />
              </div>

              {/* Portfolio Links */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Portfolio Links (Optional)
                </label>
                <div className="space-y-3">
                  {applicationData.portfolio_links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handlePortfolioLinkChange(index, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                      />
                      {applicationData.portfolio_links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioLink(index)}
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-xs sm:text-sm whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddPortfolioLink}
                  className="mt-3 px-3 sm:px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold text-xs sm:text-sm"
                >
                  + Add Link
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
