"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ModelReviewPage() {
  const [pendingModels, setPendingModels] = useState([
    { id: 1, name: "Futuristic Drone", author: "NewCreator", polyCount: 45000, uploaded: "2 hours ago", image: "🚁", status: "pending" },
    { id: 2, name: "Ancient Temple", author: "ArchMaster", polyCount: 120000, uploaded: "5 hours ago", image: "🏛️", status: "pending" },
    { id: 3, name: "Sci-Fi Weapon", author: "GunSmith3D", polyCount: 32000, uploaded: "1 day ago", image: "🔫", status: "pending" },
  ]);

  const handleApprove = (id: number) => {
    setPendingModels(prev => prev.filter(m => m.id !== id));
    // TODO: Call API to approve model
    alert("Model approved!");
  };

  const handleReject = (id: number) => {
    setPendingModels(prev => prev.filter(m => m.id !== id));
    // TODO: Call API to reject model
    alert("Model rejected!");
  };

  return (
    <AdminLayout title="Model Validator Queue">
      <div className="grid gap-6">
        {pendingModels.map((model) => (
          <div key={model.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Model Preview */}
              <div className="lg:col-span-1">
                <div className="aspect-square bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl flex items-center justify-center text-8xl border border-yellow-600/20">
                  {model.image}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition">
                  🔍 Open 3D Viewer
                </button>
              </div>

              {/* Model Info */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                <p className="text-gray-400 mb-4">by {model.author} • Uploaded {model.uploaded}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Polygon Count</div>
                    <div className="text-white font-bold text-lg">{model.polyCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">File Formats</div>
                    <div className="text-white font-bold text-lg">.glb, .fbx</div>
                  </div>
                </div>

                {/* Quality Checks */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <span className="text-green-400">✓ Topology Check</span>
                    <span className="text-green-400 font-bold">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <span className="text-green-400">✓ Texture Quality</span>
                    <span className="text-green-400 font-bold">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <span className="text-yellow-400">⚠ File Size</span>
                    <span className="text-yellow-400 font-bold">WARNING</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleApprove(model.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold"
                  >
                    ✓ APPROVE & PUBLISH
                  </button>
                  <button 
                    onClick={() => handleReject(model.id)}
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
  );
}
