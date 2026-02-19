"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty } from "@/lib/api/hooks/useBounties";
import { submitWork } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function SubmitWorkPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = parseInt(params.id as string);
  
  const { bounty, loading, error } = useBounty(bountyId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    model_url: "",
    preview_images: [""],
    notes: "",
  });

  const handleAddPreviewImage = () => {
    setFormData(prev => ({
      ...prev,
      preview_images: [...prev.preview_images, ""]
    }));
  };

  const handleRemovePreviewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preview_images: prev.preview_images.filter((_, i) => i !== index)
    }));
  };

  const handlePreviewImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      preview_images: prev.preview_images.map((img, i) => i === index ? value : img)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model_url) {
      setSubmitError("Please provide the model URL");
      return;
    }

    const filteredImages = formData.preview_images.filter(img => img.trim() !== "");

    try {
      setSubmitting(true);
      setSubmitError(null);

      await submitWork(bountyId, {
        model_url: formData.model_url,
        preview_images: filteredImages,
        notes: formData.notes,
      });

      router.push("/bounties/my-claimed");
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to submit work");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

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
              Submit Work
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href={`/bounties/${bountyId}`} className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              View Bounty
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Bounty Info */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur mb-8">
          <h2 className="text-2xl font-black text-white mb-2">{bounty?.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>
              <span className="text-orange-400 font-bold">${bounty?.budget}</span> payment
            </div>
            <div>•</div>
            <div>
              Posted by <span className="text-white font-medium">{bounty?.poster_username}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-black text-white mb-3">
            📤 Submit Your <span className="text-orange-500">Work</span>
          </h3>
          <p className="text-slate-400">
            Upload your completed model and provide any additional notes for the buyer.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
            <p className="text-red-400">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model URL */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Model File URL <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-slate-400 mb-3">
              Upload your model to a file hosting service and paste the download link here
            </p>
            <input
              type="url"
              value={formData.model_url}
              onChange={(e) => setFormData(prev => ({ ...prev, model_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Preview Images */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Preview Images
            </label>
            <p className="text-sm text-slate-400 mb-4">
              Add preview images or renders of your model
            </p>
            
            <div className="space-y-3">
              {formData.preview_images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handlePreviewImageChange(index, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  />
                  {formData.preview_images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewImage(index)}
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
              onClick={handleAddPreviewImage}
              className="mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold"
            >
              + Add Image
            </button>
          </div>

          {/* Notes */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about your submission..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Requirements Checklist */}
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
            <h4 className="text-white font-bold mb-3">✓ Requirements Checklist</h4>
            <ul className="space-y-2">
              {bounty?.requirements?.map((req: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="text-orange-400 mt-0.5">□</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/bounties/my-claimed"
              className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Work"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
