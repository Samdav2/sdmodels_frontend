"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty, useBountySubmission } from "@/lib/api/hooks/useBounties";
import { approveSubmission, requestRevision, rejectSubmission } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function ReviewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = parseInt(params.id as string);
  
  const { bounty, loading: bountyLoading } = useBounty(bountyId);
  const { submission, loading: submissionLoading, error } = useBountySubmission(bountyId);
  const [processing, setProcessing] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState<"revision" | "reject" | null>(null);

  const handleApprove = async () => {
    if (!confirm("Approve this submission and release payment? This action cannot be undone.")) return;

    try {
      setProcessing(true);
      await approveSubmission(bountyId, submission.id);
      router.push("/bounties/my-posted");
    } catch (err) {
      alert("Failed to approve submission");
    } finally {
      setProcessing(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please provide feedback");
      return;
    }

    try {
      setProcessing(true);
      
      if (action === "revision") {
        await requestRevision(bountyId, submission.id, feedback);
      } else if (action === "reject") {
        await rejectSubmission(bountyId, submission.id, feedback);
      }

      setShowFeedbackModal(false);
      router.push("/bounties/my-posted");
    } catch (err) {
      alert(`Failed to ${action} submission`);
    } finally {
      setProcessing(false);
    }
  };

  if (bountyLoading || submissionLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!submission) return <ErrorMessage error="No submission found" />;

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
              Review Submission
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/bounties/my-posted" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              My Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Bounty Info */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur mb-8">
          <h2 className="text-2xl font-black text-white mb-2">{bounty?.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>
              <span className="text-orange-400 font-bold">${bounty?.budget}</span> payment
            </div>
            <div>•</div>
            <div>
              Artist: <span className="text-white font-medium">{bounty?.claimed_by_username}</span>
            </div>
            <div>•</div>
            <div>
              Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-3xl font-black text-white mb-3">
            🔍 Review <span className="text-orange-500">Submission</span>
          </h3>
          <p className="text-slate-400">
            Review the submitted work and decide whether to approve, request revisions, or reject.
          </p>
        </div>

        {/* Submission Details */}
        <div className="space-y-6">
          {/* Model File */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <h4 className="text-white font-bold mb-4">📦 Model File</h4>
            <a
              href={submission.model_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50"
            >
              Download Model →
            </a>
          </div>

          {/* Preview Images */}
          {submission.preview_images && submission.preview_images.length > 0 && (
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h4 className="text-white font-bold mb-4">🖼️ Preview Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submission.preview_images.map((img: string, index: number) => (
                  <a
                    key={index}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-slate-950/50 border border-slate-700 rounded-lg overflow-hidden hover:border-orange-500 transition"
                  >
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23334155' width='400' height='300'/%3E%3Ctext fill='%23cbd5e1' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage Preview%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {submission.notes && (
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h4 className="text-white font-bold mb-4">📝 Artist Notes</h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {submission.notes}
              </p>
            </div>
          )}

          {/* Requirements Checklist */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <h4 className="text-white font-bold mb-4">✓ Requirements Checklist</h4>
            <p className="text-sm text-slate-400 mb-4">Verify that all requirements have been met:</p>
            <ul className="space-y-2">
              {bounty?.requirements?.map((req: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <span className="text-orange-400 mt-0.5">□</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
            <h4 className="text-white font-bold mb-4">⚡ Take Action</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setAction("reject");
                  setShowFeedbackModal(true);
                }}
                disabled={processing}
                className="px-6 py-4 bg-red-500/20 border-2 border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition font-semibold disabled:opacity-50"
              >
                ✗ Reject
              </button>
              <button
                onClick={() => {
                  setAction("revision");
                  setShowFeedbackModal(true);
                }}
                disabled={processing}
                className="px-6 py-4 bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition font-semibold disabled:opacity-50"
              >
                🔄 Request Revision
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50"
              >
                ✓ Approve & Pay
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-orange-500 rounded-xl p-6 sm:p-8 max-w-2xl w-full"
          >
            <h3 className="text-2xl font-black text-white mb-4">
              {action === "revision" ? "Request Revision" : "Reject Submission"}
            </h3>
            <p className="text-slate-400 mb-6">
              {action === "revision" 
                ? "Explain what needs to be changed or improved:"
                : "Explain why you're rejecting this submission:"}
            </p>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none mb-6"
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50"
              >
                {processing ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
