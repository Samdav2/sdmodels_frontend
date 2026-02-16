"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SliderManagerPage() {
  const [sliderSlots, setSliderSlots] = useState([
    { id: 1, model: { name: "Cyberpunk Mech Warrior", author: "PixelForge", image: "🤖" } },
    { id: 2, model: { name: "Sci-Fi Vehicle", author: "3D_Wizard", image: "🚗" } },
    { id: 3, model: { name: "Dragon Animated", author: "MeshMaster", image: "🐉" } },
  ]);

  const availableModels = [
    { id: 4, name: "Fantasy Castle", author: "PolyPro", image: "🏰", views: 2340 },
    { id: 5, name: "Space Station", author: "VoxelVerse", image: "🚀", views: 1890 },
    { id: 6, name: "Robot Companion", author: "PixelForge", image: "🤖", views: 3120 },
    { id: 7, name: "Medieval Sword", author: "3D_Wizard", image: "⚔️", views: 1560 },
    { id: 8, name: "Racing Car", author: "MeshMaster", image: "🏎️", views: 2780 },
  ];

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
    // Auto-select top 3 trending models
    const topModels = [...availableModels].sort((a, b) => b.views - a.views).slice(0, 3);
    setSliderSlots(prev => prev.map((slot, index) => ({
      ...slot,
      model: topModels[index] ? { name: topModels[index].name, author: topModels[index].author, image: topModels[index].image } : slot.model
    })));
    alert("Auto-selected top trending models!");
  };

  const handleDeploy = () => {
    // TODO: Call API to deploy slider
    alert("Slider deployed to homepage!");
  };

  return (
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
  );
}
