"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface PhysicsRagdollTesterProps {
  onPhysicsChange: (settings: PhysicsSettings) => void;
  onPhysicsToggle: (active: boolean) => void;
}

interface PhysicsSettings {
  gravity: number;
  wind: number;
  bounce: number;
  friction: number;
}

export default function PhysicsRagdollTester({ onPhysicsChange, onPhysicsToggle }: PhysicsRagdollTesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<PhysicsSettings>({
    gravity: 9.8,
    wind: 0,
    bounce: 0.5,
    friction: 0.8,
  });

  const handleSettingChange = (key: keyof PhysicsSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onPhysicsChange(newSettings);
  };

  const togglePhysics = () => {
    const newState = !isActive;
    setIsActive(newState);
    onPhysicsToggle(newState);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: isActive ? 'info' : 'success',
          title: isActive ? 'Physics Disabled' : 'Physics Enabled!',
          message: isActive 
            ? 'Physics simulation stopped' 
            : 'Watch the model react to gravity and wind! Adjust settings below.',
          autoClose: 3000,
        }
      }));
    }
  };

  const applyPreset = (preset: 'earth' | 'moon' | 'zero' | 'storm') => {
    let newSettings: PhysicsSettings;
    
    switch (preset) {
      case 'earth':
        newSettings = { gravity: 9.8, wind: 0, bounce: 0.5, friction: 0.8 };
        break;
      case 'moon':
        newSettings = { gravity: 1.6, wind: 0, bounce: 0.7, friction: 0.3 };
        break;
      case 'zero':
        newSettings = { gravity: 0, wind: 0, bounce: 1.0, friction: 0 };
        break;
      case 'storm':
        newSettings = { gravity: 9.8, wind: 15, bounce: 0.3, friction: 0.9 };
        break;
    }
    
    setSettings(newSettings);
    onPhysicsChange(newSettings);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: `${preset.charAt(0).toUpperCase() + preset.slice(1)} Preset Applied`,
          message: `Physics settings updated to ${preset} environment`,
          autoClose: 2000,
        }
      }));
    }
  };

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="text-sm font-semibold text-white">Physics & Ragdoll</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Activation Toggle */}
          <button
            onClick={togglePhysics}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              isActive
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {isActive ? "🟢 Physics Active" : "⚪ Enable Physics"}
          </button>

          {/* Quick Presets */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Environment Presets</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPreset('earth')}
                className="p-3 bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition"
              >
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-xs font-semibold text-white">Earth</div>
                <div className="text-xs text-gray-400">9.8 m/s²</div>
              </button>

              <button
                onClick={() => applyPreset('moon')}
                className="p-3 bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30 rounded-lg hover:border-gray-500/50 transition"
              >
                <div className="text-2xl mb-1">🌙</div>
                <div className="text-xs font-semibold text-white">Moon</div>
                <div className="text-xs text-gray-400">1.6 m/s²</div>
              </button>

              <button
                onClick={() => applyPreset('zero')}
                className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition"
              >
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-xs font-semibold text-white">Zero-G</div>
                <div className="text-xs text-gray-400">0 m/s²</div>
              </button>

              <button
                onClick={() => applyPreset('storm')}
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition"
              >
                <div className="text-2xl mb-1">🌪️</div>
                <div className="text-xs font-semibold text-white">Storm</div>
                <div className="text-xs text-gray-400">High Wind</div>
              </button>
            </div>
          </div>

          {/* Gravity Control */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Gravity</label>
              <span className="text-white font-mono font-bold">{settings.gravity.toFixed(1)} m/s²</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={settings.gravity}
              onChange={(e) => handleSettingChange('gravity', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Wind Control */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Wind Force</label>
              <span className="text-cyan-400 font-mono font-bold">{settings.wind.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={settings.wind}
              onChange={(e) => handleSettingChange('wind', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Bounce Control */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Bounciness</label>
              <span className="text-purple-400 font-mono font-bold">{settings.bounce.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.bounce}
              onChange={(e) => handleSettingChange('bounce', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Friction Control */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Friction</label>
              <span className="text-yellow-400 font-mono font-bold">{settings.friction.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.friction}
              onChange={(e) => handleSettingChange('friction', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="text-xs text-orange-300 mb-2 font-semibold">
              💡 How to Use
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Enable physics to activate simulation</div>
              <div>• Click and drag model to toss it</div>
              <div>• Watch cloth, hair, and rigging react</div>
              <div>• Test weight painting quality</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
