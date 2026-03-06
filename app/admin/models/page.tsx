"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminModels } from "@/lib/api/hooks/useAdminModels";
import { useAdminModal } from "@/components/admin/AdminModal";

export default function ModelReviewPage() {
  const { models: pendingModels, loading, error, approveModel, rejectModel } = useAdminModels();
  const { showAlert, showConfirm, AdminModalComponent } = useAdminModal();

  const handleApprove = async (id: number, title: string) => {
    const confirmed = await showConfirm(
      "Approve Model",
      `Approve "${title}" and publish to marketplace?`,
      "success"
    );
    
    if (confirmed) {
      try {
        await approveModel(id);
        await showAlert("Success", "Model approved and published!", "success");
      } catch (err) {
        await showAlert("Error", "Failed to approve model", "danger");
      }
    }
  };

  const handleReject = async (id: number, title: string) => {
    const confirmed = await showConfirm(
      "Reject Model",
      `Reject "${title}"? This will notify the creator.`,
      "danger"
    );
    
    if (confirmed) {
      try {
        await rejectModel(id, "Does not meet quality standards");
        await showAlert("Success", "Model rejected", "success");
      } catch (err) {
        await showAlert("Error", "Failed to reject model", "danger");
      }
    }
  };

  if (loading) {
    return (<AdminLayout title="Model Validator Queue">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading pending models...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Model Validator Queue">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Models</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
    <AdminLayout title="Model Validator Queue">
      {AdminModalComponent}
      
      <div className="grid gap-6">
        {pendingModels.map((model: any) => (
          <div key={model.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Model Preview */}
              <div className="lg:col-span-1">
                {model.thumbnail_url ? (
                  <img 
                    src={model.thumbnail_url} 
                    alt={model.title}
                    className="w-full aspect-square object-cover rounded-xl border border-yellow-600/20"
                  />
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl flex items-center justify-center text-8xl border border-yellow-600/20">
                    🎨
                  </div>
                )}
                <button className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition">
                  🔍 Open 3D Viewer
                </button>
              </div>

              {/* Model Info */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-2">{model.title}</h3>
                <p className="text-gray-400 mb-4">
                  by {model.creator_username} • Uploaded {new Date(model.created_at).toLocaleDateString()}
                </p>

                {model.description && (
                  <p className="text-gray-300 mb-4 line-clamp-2">{model.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Category</div>
                    <div className="text-white font-bold text-lg">{model.category || "Uncategorized"}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Price</div>
                    <div className="text-white font-bold text-lg">
                      {model.is_free ? "FREE" : `$${model.price}`}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Views</div>
                    <div className="text-white font-bold text-lg">{model.views || 0}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Likes</div>
                    <div className="text-white font-bold text-lg">{model.likes || 0}</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    model.status === 'pending' 
                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                      : model.status === 'approved'
                      ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                      : 'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {model.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleApprove(model.id, model.title)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold"
                  >
                    ✓ APPROVE & PUBLISH
                  </button>
                  <button 
                    onClick={() => handleReject(model.id, model.title)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-500 hover:to-pink-500 transition font-bold"
                  >
                    ✕ REJECT
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {pendingModels.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">All caught up!</h3>
            <p className="text-gray-400">No pending models to review</p>
          </div>
        )}
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
