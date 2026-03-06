"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { modelsApi } from "@/lib/api/models";
import { Model } from "@/lib/api/types";
import AlertModal from "@/components/AlertModal";
import { useAuth } from "@/lib/api/hooks/useAuth";

export default function EditModelPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id as string;
  const { user } = useAuth();

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchModel();
  }, [modelId, user]);

  const fetchModel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modelsApi.getModel(modelId);
      setModel(data);
      
      // Check if current user is the creator
      if (user && data.creator_id === user.id) {
        setIsAuthorized(true);
        
        // Populate form
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setTags(data.tags || []);
      } else {
        setIsAuthorized(false);
        setError("You are not authorized to edit this model. Only the creator can edit their models.");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthorized) {
      setError("You are not authorized to edit this model.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await modelsApi.updateModel(modelId, {
        title,
        description,
        price,
        category,
        tags,
        is_free: price === 0,
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        router.push(`/dashboard/inventory/${modelId}`);
      }, 2000);
    } catch (err: any) {
      // Handle 403 Forbidden error
      if (err.response?.status === 403) {
        setError("Not authorized to update this model. Only the creator can edit their models.");
      } else {
        setError(err.message || 'Failed to update model');
      }
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">✏️</div>
              <p className="text-slate-400">Loading model...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && !model) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">
                {isAuthorized === false ? "Not Authorized" : "Error Loading Model"}
              </h3>
              <p className="text-slate-400 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/dashboard/inventory')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold"
                >
                  Back to Inventory
                </button>
                {model && (
                  <button
                    onClick={() => router.push(`/dashboard/inventory/${modelId}`)}
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/inventory/${modelId}`)}
              className="p-2 bg-slate-900/50 border border-orange-500/30 rounded-lg hover:bg-slate-800 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Edit Model</h1>
              <p className="text-sm text-slate-400">Update your model details</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !isAuthorized}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="max-w-4xl space-y-6">
          {/* Title */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
            <label className="block text-white font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              placeholder="Enter model title..."
            />
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
            <label className="block text-white font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition resize-none"
              placeholder="Describe your model..."
            />
          </div>

          {/* Price & Category */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <label className="block text-white font-bold mb-2">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <label className="block text-white font-bold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              >
                <option value="">Select category...</option>
                <option value="Characters">Characters</option>
                <option value="Environments">Environments</option>
                <option value="Props">Props</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Weapons">Weapons</option>
                <option value="Architecture">Architecture</option>
                <option value="Nature">Nature</option>
                <option value="Animals">Animals</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
            <label className="block text-white font-bold mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className="px-6 py-2 bg-orange-500/20 border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-500/20 border border-orange-500 text-orange-400 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <AlertModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Changes Saved"
          message="Your model has been successfully updated. Redirecting..."
          type="success"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
