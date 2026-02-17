"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminHomepage } from "@/lib/api/hooks/useAdminHomepage";

export default function HomepageEditorPage() {
  const { homepage, loading, error, updateHomepage } = useAdminHomepage();
  
  const [heroTitle, setHeroTitle] = useState(homepage.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(homepage.heroSubtitle);
  const [featuredCategories, setFeaturedCategories] = useState(homepage.featuredCategories);
  const [stats, setStats] = useState(homepage.stats);
  const [ctas, setCtas] = useState(homepage.ctas);

  const handlePublish = async () => {
    await updateHomepage({
      heroTitle,
      heroSubtitle,
      featuredCategories,
      stats,
      ctas,
    });
    alert("Homepage changes published!");
  };

  if (loading) {
    return (<AdminLayout title="Homepage Dynamic Editor">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading homepage settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Homepage Dynamic Editor">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Settings</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const toggleCategory = (id: number) => {
    setFeaturedCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, enabled: !cat.enabled } : cat)
    );
  };

  return (
    <ProtectedRoute>
    <AdminLayout title="Homepage Dynamic Editor">
      {/* Hero Section Editor */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 text-lg font-bold"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Hero Subtitle</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Featured Categories</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {featuredCategories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-white font-bold">{cat.name}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cat.enabled}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-5 h-5"
                />
                <span className="text-gray-400 text-sm">Visible</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Ticker */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Live Stats Ticker</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Total Models</label>
            <input
              type="number"
              value={stats.totalModels}
              onChange={(e) => setStats({ ...stats, totalModels: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Active Creators</label>
            <input
              type="number"
              value={stats.activeCreators}
              onChange={(e) => setStats({ ...stats, activeCreators: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Downloads Today</label>
            <input
              type="number"
              value={stats.downloadsToday}
              onChange={(e) => setStats({ ...stats, downloadsToday: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Call to Action Buttons</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Primary CTA Text</label>
              <input
                type="text"
                value={ctas.primaryText}
                onChange={(e) => setCtas({ ...ctas, primaryText: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Primary CTA Link</label>
              <input
                type="text"
                value={ctas.primaryLink}
                onChange={(e) => setCtas({ ...ctas, primaryLink: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Secondary CTA Text</label>
              <input
                type="text"
                value={ctas.secondaryText}
                onChange={(e) => setCtas({ ...ctas, secondaryText: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Secondary CTA Link</label>
              <input
                type="text"
                value={ctas.secondaryLink}
                onChange={(e) => setCtas({ ...ctas, secondaryLink: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handlePublish}
          className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition font-bold text-lg"
        >
          🚀 PUBLISH HOMEPAGE CHANGES
        </button>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
