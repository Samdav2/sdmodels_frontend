"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface LightingStudioProps {
  onLightingChange: (settings: LightingSettings) => void;
}

export interface LightingSettings {
  environment: string;
  intensity: number;
  keyLightColor: string;
  fillLightColor: string;
  rimLightColor: string;
  shadows: boolean;
  ambientOcclusion: boolean;
}

export default function LightingStudio({ onLightingChange }: LightingStudioProps) {
  const [settings, setSettings] = useState<LightingSettings>({
    environment: "studio",
    intensity: 1.0,
    keyLightColor: "#ffffff",
    fillLightColor: "#ff8c42",
    rimLightColor: "#ffa552",
    shadows: true,
    ambientOcclusion: true,
  });

  const [isOpen, setIsOpen] = useState(false);

  const environments = [
    { name: "Studio", value: "studio", icon: "🎬" },
    { name: "Sunset", value: "sunset", icon: "🌅" },
    { name: "Night", value: "night", icon: "🌙" },
    { name: "Warehouse", value: "warehouse", icon: "🏭" },
    { name: "Forest", value: "forest", icon: "🌲" },
    { name: "City", value: "city", icon: "🏙️" },
  ];

  const updateSetting = <K extends keyof LightingSettings>(
    key: K,
    value: LightingSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onLightingChange(newSettings);
  };

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <span className="text-sm font-semibold text-white">Lighting Studio</span>
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
          {/* Environment Presets */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Environment</label>
            <div className="grid grid-cols-3 gap-2">
              {environments.map((env) => (
                <button
                  key={env.value}
                  onClick={() => updateSetting("environment", env.value)}
                  className={`p-2 rounded-lg transition text-xs ${
                    settings.environment === env.value
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  <div className="text-lg mb-1">{env.icon}</div>
                  <div>{env.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Intensity: {settings.intensity.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.intensity}
              onChange={(e) => updateSetting("intensity", parseFloat(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dark</span>
              <span>Bright</span>
            </div>
          </div>

          {/* Light Colors */}
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Key Light</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.keyLightColor}
                  onChange={(e) => updateSetting("keyLightColor", e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.keyLightColor}
                  onChange={(e) => updateSetting("keyLightColor", e.target.value)}
                  className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Fill Light</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.fillLightColor}
                  onChange={(e) => updateSetting("fillLightColor", e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.fillLightColor}
                  onChange={(e) => updateSetting("fillLightColor", e.target.value)}
                  className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Rim Light</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.rimLightColor}
                  onChange={(e) => updateSetting("rimLightColor", e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.rimLightColor}
                  onChange={(e) => updateSetting("rimLightColor", e.target.value)}
                  className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <button
              onClick={() => updateSetting("shadows", !settings.shadows)}
              className={`w-full py-2 rounded-lg transition text-sm ${
                settings.shadows
                  ? "bg-orange-500 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {settings.shadows ? "🌑 Shadows ON" : "🌑 Shadows OFF"}
            </button>

            <button
              onClick={() => updateSetting("ambientOcclusion", !settings.ambientOcclusion)}
              className={`w-full py-2 rounded-lg transition text-sm ${
                settings.ambientOcclusion
                  ? "bg-orange-500 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {settings.ambientOcclusion ? "🎨 AO ON" : "🎨 AO OFF"}
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Quick Presets</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    keyLightColor: "#ffffff",
                    fillLightColor: "#ff8c42",
                    intensity: 1.5,
                  };
                  setSettings(preset);
                  onLightingChange(preset);
                }}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                ☀️ Bright
              </button>
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    keyLightColor: "#4a5568",
                    fillLightColor: "#2d3748",
                    intensity: 0.5,
                  };
                  setSettings(preset);
                  onLightingChange(preset);
                }}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                🌙 Moody
              </button>
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    keyLightColor: "#ff6b35",
                    fillLightColor: "#cc0044",
                    intensity: 1.2,
                  };
                  setSettings(preset);
                  onLightingChange(preset);
                }}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                🔥 Dramatic
              </button>
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    keyLightColor: "#00d9ff",
                    fillLightColor: "#9d4edd",
                    intensity: 1.0,
                  };
                  setSettings(preset);
                  onLightingChange(preset);
                }}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                🎨 Neon
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
