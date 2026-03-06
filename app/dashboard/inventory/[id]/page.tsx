"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { modelsApi } from "@/lib/api/models";
import { Model } from "@/lib/api/types";
import ModelViewer3D from "@/components/ModelViewer3D";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";
import { useAuth } from "@/lib/api/hooks/useAuth";

export default function ModelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id as string;
  const { user } = useAuth();

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerMode, setViewerMode] = useState<"basic" | "advanced">("basic");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if current user is the creator
  const isCreator = user && model && user.id === model.creator_id;

  useEffect(() => {
    fetchModel();
  }, [modelId]);

  const fetchModel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modelsApi.getModel(modelId);
      setModel(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await modelsApi.deleteModel(modelId);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/dashboard/inventory');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete model');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/inventory/${modelId}/edit`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🎨</div>
              <p className="text-slate-400">Loading model details...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !model) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Model</h3>
              <p className="text-slate-400 mb-4">{error || 'Model not found'}</p>
              <button
                onClick={() => router.push('/dashboard/inventory')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold"
              >
                Back to Inventory
              </button>
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
              onClick={() => router.push('/dashboard/inventory')}
              className="p-2 bg-slate-900/50 border border-orange-500/30 text-orange-400  rounded-lg hover:bg-slate-800 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{model.title}</h1>
              <p className="text-sm text-slate-400">Model Details & 3D Preview</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isCreator && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold"
                >
                  🗑️ Delete
                </button>
              </>
            )}
            {!isCreator && model && (
              <div className="px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-lg">
                <span className="text-sm">👤 View Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 3D Viewer */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">3D Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewerMode("basic")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    viewerMode === "basic"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setViewerMode("advanced")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    viewerMode === "advanced"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <div className="h-[500px]">
              {viewerMode === "basic" ? (
                <ModelViewer3D 
                  modelUrl={model.file_url} 
                  fileFormat={model.file_formats && model.file_formats.length > 0 ? model.file_formats[0].toLowerCase() : undefined}
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <p className="text-slate-400">Advanced viewer coming soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Model Information */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Views</div>
                  <div className="text-2xl font-bold text-white">{model.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Downloads</div>
                  <div className="text-2xl font-bold text-green-400">{model.downloads.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Likes</div>
                  <div className="text-2xl font-bold text-pink-400">{model.likes.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Revenue</div>
                  <div className="text-2xl font-bold text-orange-400">
                    ${(model.price * model.downloads * 0.925).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <h3 className="text-lg font-bold text-white mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-bold">${model.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white font-semibold">{model.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    model.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    model.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Poly Count</span>
                  <span className="text-white font-mono">{model.poly_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vertex Count</span>
                  <span className="text-white font-mono">{model.vertex_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size</span>
                  <span className="text-white font-mono">{(model.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Uploaded</span>
                  <span className="text-white">{new Date(model.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <h3 className="text-lg font-bold text-white mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`flex items-center gap-2 ${model.has_animations ? 'text-green-400' : 'text-slate-500'}`}>
                  {model.has_animations ? '✅' : '❌'} Animations
                </div>
                <div className={`flex items-center gap-2 ${model.has_rigging ? 'text-green-400' : 'text-slate-500'}`}>
                  {model.has_rigging ? '✅' : '❌'} Rigging
                </div>
                <div className={`flex items-center gap-2 ${model.has_materials ? 'text-green-400' : 'text-slate-500'}`}>
                  {model.has_materials ? '✅' : '❌'} Materials
                </div>
                <div className={`flex items-center gap-2 ${model.has_textures ? 'text-green-400' : 'text-slate-500'}`}>
                  {model.has_textures ? '✅' : '❌'} Textures
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
              <h3 className="text-lg font-bold text-white mb-4">Description</h3>
              <p className="text-slate-300 leading-relaxed">{model.description}</p>
            </div>

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur p-6">
                <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/20 border border-orange-500 text-orange-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Model?"
          message="This action cannot be undone. The model will be permanently deleted from your inventory and the marketplace."
          confirmText={deleting ? "Deleting..." : "Delete Forever"}
          type="danger"
        />

        {/* Success Modal */}
        <AlertModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Model Deleted"
          message="Your model has been successfully deleted. Redirecting to inventory..."
          type="success"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
