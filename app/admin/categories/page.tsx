"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Characters", icon: "🤖", count: 456, enabled: true },
    { id: 2, name: "Vehicles", icon: "🚗", count: 234, enabled: true },
    { id: 3, name: "Environments", icon: "🏰", count: 189, enabled: true },
    { id: 4, name: "Weapons", icon: "⚔️", count: 167, enabled: true },
    { id: 5, name: "Props", icon: "📦", count: 345, enabled: true },
    { id: 6, name: "UI Elements", icon: "🎮", count: 123, enabled: false },
  ]);

  const toggleEnabled = (id: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
    ));
  };

  return (
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
                    onChange={() => toggleEnabled(category.id)}
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
  );
}
