"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminSlider } from "@/lib/api/hooks/useAdminSlider";

export default function SliderManagerPage() {
  const { sliderSlots, availableModels, loading, error, updateSlider, setSliderSlots } = useAdminSlider();

  const handleRemove = (slotId: number) => {
    setSliderSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, model: null as any } : slot
    ));
  };

  const handleAddToSlot = (modelId: number, slotId: number) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setSliderSlots(prev => prev.map(slot =>
        slot.id === slotId ? { ...slot, model: { name: model.name, author: model.author, image: model.image } } : slot
      ));
    }
  };

  const handleAutoSelect = () => {
    const topModels = [...availableModels].sort((a, b) => b.views - a.views).slice(0, 3);
    setSliderSlots(prev => prev.map((slot, index) => ({
      ...slot,
      model: topModels[index] ? { name: topModels[index].name, author: topModels[index].author, image: topModels[index].image } : slot.model
    })));
    alert("Auto-selected top trending models!");
  };

  const handleDeploy = async () => {
    await updateSlider(sliderSlots);
    alert("Slider deployed to homepage!");
  };

  if (loading) {
    return (<AdminLayout title="Homepage Slider Architect">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading slider settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Homepage Slider Architect">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Slider</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute>
    <AdminLayout title="Homepage Slider Architect">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Manage Featured Slider</h3>
        <button 
          onClick={handleAutoSelect}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold"
        >
          🤖 Auto-Select Top Trending
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Slider Slots */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Current Slider (Live)</h3>
          {sliderSlots.map((slot, index) => (
            <div key={slot.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-yellow-400 font-bold">Slot {index + 1}</span>
                {slot.model && (
                  <button 
                    onClick={() => handleRemove(slot.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              {slot.model ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-4xl">
                    {slot.model.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{slot.model.name}</h4>
                    <p className="text-gray-400 text-sm">by {slot.model.author}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Empty Slot - Add a model
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={handleDeploy}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold text-lg"
          >
            🚀 DEPLOY TO HOMEPAGE
          </button>
        </div>

        {/* Available Models */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Available Models</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {availableModels.map((model) => (
              <div
                key={model.id}
                className="bg-slate-900/70 backdrop-blur-xl border border-yellow-600/20 rounded-xl p-4 hover:border-yellow-600 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-3xl">
                    {model.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm">{model.name}</h4>
                    <p className="text-gray-400 text-xs">by {model.author}</p>
                    <p className="text-cyan-400 text-xs mt-1">👁️ {model.views.toLocaleString()} views</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {sliderSlots.map((slot, idx) => (
                      <button 
                        key={slot.id}
                        onClick={() => handleAddToSlot(model.id, slot.id)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs font-bold transition"
                      >
                        → Slot {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
