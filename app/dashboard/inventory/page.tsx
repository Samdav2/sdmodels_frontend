"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

interface Model {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  polyCount: number;
  status: "public" | "private" | "draft";
  sales: number;
  downloads: number;
  views: number;
  revenue: number;
  uploadDate: string;
}

const mockModels: Model[] = [
  {
    id: "1",
    name: "Cyberpunk Vehicle",
    thumbnail: "/api/placeholder/200/200",
    price: 29.99,
    polyCount: 5420,
    status: "public",
    sales: 45,
    downloads: 45,
    views: 1240,
    revenue: 1349.55,
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Sci-Fi Character Rig",
    thumbnail: "/api/placeholder/200/200",
    price: 49.99,
    polyCount: 12500,
    status: "public",
    sales: 32,
    downloads: 32,
    views: 890,
    revenue: 1599.68,
    uploadDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Futuristic Weapon",
    thumbnail: "/api/placeholder/200/200",
    price: 19.99,
    polyCount: 8200,
    status: "draft",
    sales: 0,
    downloads: 0,
    views: 0,
    revenue: 0,
    uploadDate: "2024-02-01",
  },
];

export default function InventoryPage() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id === id) {
          const statuses: Array<"public" | "private" | "draft"> = ["public", "private", "draft"];
          const currentIndex = statuses.indexOf(model.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...model, status: nextStatus };
        }
        return model;
      })
    );
  };

  const deleteModel = (id: string) => {
    setModels((prev) => prev.filter((model) => model.id !== id));
    setDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "public":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "private":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "draft":
        return "text-slate-400 bg-slate-500/20 border-slate-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">Asset Management Terminal</h1>
          <p className="text-sm sm:text-base text-slate-400">Control room for your 3D inventory</p>
        </div>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="flex gap-1 sm:gap-2 p-1 bg-slate-900/50 border border-orange-500/30 rounded-lg flex-1 sm:flex-none">
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                viewMode === "table"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="hidden sm:inline">📋 Table</span>
              <span className="sm:hidden">📋</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                viewMode === "grid"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="hidden sm:inline">🔲 Grid</span>
              <span className="sm:hidden">🔲</span>
            </button>
          </div>

          <Link
            href="/upload"
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 text-center"
          >
            <span className="hidden sm:inline">+ Upload New</span>
            <span className="sm:hidden">+ Upload</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur">
          <div className="text-xs text-slate-400 mb-1">Total Models</div>
          <div className="text-xl sm:text-2xl font-black text-white">{models.length}</div>
        </div>
        <div className="bg-slate-900/50 border border-green-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur">
          <div className="text-xs text-slate-400 mb-1">Public</div>
          <div className="text-xl sm:text-2xl font-black text-green-400">
            {models.filter((m) => m.status === "public").length}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur">
          <div className="text-xs text-slate-400 mb-1">Private</div>
          <div className="text-xl sm:text-2xl font-black text-yellow-400">
            {models.filter((m) => m.status === "private").length}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur">
          <div className="text-xs text-slate-400 mb-1">Drafts</div>
          <div className="text-xl sm:text-2xl font-black text-slate-400">
            {models.filter((m) => m.status === "draft").length}
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Model</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Status</th>
                  <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Price</th>
                  <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Sales</th>
                  <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Revenue</th>
                  <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Views</th>
                  <th className="text-center p-3 sm:p-4 text-xs sm:text-sm font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {models.map((model) => (
                    <motion.tr
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="border-b border-slate-700/50 hover:bg-slate-800/30 transition group"
                    >
                      {/* Model Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50">
                            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-2xl">
                              🎨
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{model.name}</div>
                            <div className="text-xs text-slate-400">{model.polyCount.toLocaleString()} polys</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleStatus(model.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            model.status
                          )} hover:scale-105 transition`}
                        >
                          {model.status}
                        </button>
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right">
                        <span className="text-sm font-mono text-white">${model.price}</span>
                      </td>

                      {/* Sales */}
                      <td className="p-4 text-right">
                        <span className="text-sm font-bold text-green-400">{model.sales}</span>
                      </td>

                      {/* Revenue */}
                      <td className="p-4 text-right">
                        <span className="text-sm font-mono text-orange-400">${model.revenue.toFixed(2)}</span>
                      </td>

                      {/* Views */}
                      <td className="p-4 text-right">
                        <span className="text-sm text-slate-400">{model.views.toLocaleString()}</span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          <Link
                            href={`/upload?edit=${model.id}`}
                            className="p-2 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(model.id)}
                            className="p-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {models.map((model) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl backdrop-blur overflow-hidden group hover:border-orange-500 transition"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-6xl">
                  🎨
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleStatus(model.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        model.status
                      )}`}
                    >
                      {model.status}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{model.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div>
                      <div className="text-slate-400">Price</div>
                      <div className="text-white font-bold">${model.price}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Sales</div>
                      <div className="text-green-400 font-bold">{model.sales}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Revenue</div>
                      <div className="text-orange-400 font-bold">${model.revenue.toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Views</div>
                      <div className="text-slate-300 font-bold">{model.views}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/upload?edit=${model.id}`}
                      className="flex-1 py-2 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-center text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(model.id)}
                      className="flex-1 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-red-500 rounded-xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-black text-white mb-2">Deconstruct Model?</h3>
                <p className="text-slate-400">
                  This action cannot be undone. The model will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteModel(deleteConfirm)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-400 hover:to-red-500 transition font-semibold"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
