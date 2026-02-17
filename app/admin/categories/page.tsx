"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminCategories } from "@/lib/api/hooks/useAdminCategories";

export default function CategoryManagementPage() {
  const { categories, loading, error, toggleEnabled } = useAdminCategories();

  const handleToggleEnabled = async (id: number) => {
    await toggleEnabled(id);
  };

  if (loading) {
    return (<AdminLayout title="Category Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading categories...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Category Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Categories</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute>
    <AdminLayout title="Category Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage model categories and organization</p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold">
          ➕ Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.count} models</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.enabled}
                    onChange={() => handleToggleEnabled(category.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-400 text-sm">Active</span>
                </label>
                <button className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
