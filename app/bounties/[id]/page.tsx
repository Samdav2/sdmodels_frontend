"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty } from "@/lib/api/hooks/useBounties";
import { applyToBounty } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = parseInt(params.id as string);
  
  const { bounty, loading, error } = useBounty(bountyId);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  
  const [applicationData, setApplicationData] = useState({
    proposal: "",
    estimated_delivery: "",
    portfolio_links: [""],
  });

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
      router.push("/bounties/my-applications");
    } catch (err: any) {
      setApplyError(err.response?.data?.message || "Failed to submit application");
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!bounty) return <ErrorMessage error="Bounty not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Bounty Details
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/bounties" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Back to Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {bounty.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-sm">
                  {bounty.category}
                </span>
                <span className={`px-3 py-1.5 border rounded-lg text-sm font-medium ${getDifficultyColor(bounty.difficulty)}`}>
                  {bounty.difficulty?.toUpperCase()}
                </span>
                <span className={`px-3 py-1.5 border rounded-lg text-sm font-medium ${getStatusColor(bounty.status)}`}>
                  {bounty.status?.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-2">
                ${bounty.budget}
              </div>
              <div className="text-sm text-slate-400">
                Deadline: {new Date(bounty.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-slate-700/50 pt-4">
            <div>
              Posted by <span className="text-white font-medium">{bounty.poster_username}</span>
            </div>
            <div>•</div>
            <div>{new Date(bounty.created_at).toLocaleDateString()}</div>
            {bounty.claimed_by_username && (
              <>
                <div>•</div>
                <div>
                  Claimed by <span className="text-orange-400 font-medium">{bounty.claimed_by_username}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Description</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {bounty.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
          <ul className="space-y-2">
            {bounty.requirements?.map((req: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="text-orange-400 mt-1">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escrow Info */}
        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>🔒</span>
            Escrow Protection
          </h3>
          <p className="text-sm text-slate-300">
            Payment is held securely in escrow until you deliver the work and the buyer approves it. 
            This protects both parties and ensures fair payment.
          </p>
        </div>

        {/* Action Button */}
        {bounty.status === "open" && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-lg shadow-lg shadow-orange-500/50"
          >
            Apply for this Bounty
          </button>
        )}

        {bounty.status === "claimed" && bounty.claimed_by_username && (
          <div className="text-center p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 font-semibold">
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
            className="bg-slate-900 border-2 border-orange-500 rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-6">
              Apply for Bounty
            </h3>

            {applyError && (
              <div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
                <p className="text-red-400">{applyError}</p>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-6">
              {/* Proposal */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Your Proposal <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={applicationData.proposal}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, proposal: e.target.value }))}
                  placeholder="Explain why you're the best fit for this project..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
                  required
                />
              </div>

              {/* Estimated Delivery */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Estimated Delivery Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={applicationData.estimated_delivery}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, estimated_delivery: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  max={bounty.deadline}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                  required
                />
              </div>

              {/* Portfolio Links */}
              <div>
                <label className="block text-white font-semibold mb-2">
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
                        className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                      />
                      {applicationData.portfolio_links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioLink(index)}
                          className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition"
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
                  className="mt-3 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold"
                >
                  + Add Link
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
