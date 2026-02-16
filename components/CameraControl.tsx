"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CameraControlProps {
  onCameraChange: (settings: CameraSettings) => void;
}

export interface CameraSettings {
  fov: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  preset: string;
}

export default function CameraControl({ onCameraChange }: CameraControlProps) {
  const [settings, setSettings] = useState<CameraSettings>({
    fov: 50,
    position: { x: 5, y: 3, z: 5 },
    target: { x: 0, y: 0, z: 0 },
    preset: "default",
  });

  const [isOpen, setIsOpen] = useState(false);

  const cameraPresets = [
    { name: "Front", icon: "⬅️", position: { x: 0, y: 0, z: 8 } },
    { name: "Back", icon: "➡️", position: { x: 0, y: 0, z: -8 } },
    { name: "Left", icon: "⬆️", position: { x: -8, y: 0, z: 0 } },
    { name: "Right", icon: "⬇️", position: { x: 8, y: 0, z: 0 } },
    { name: "Top", icon: "🔝", position: { x: 0, y: 10, z: 0 } },
    { name: "Bottom", icon: "🔽", position: { x: 0, y: -10, z: 0 } },
    { name: "Isometric", icon: "📐", position: { x: 7, y: 7, z: 7 } },
    { name: "Close-up", icon: "🔍", position: { x: 2, y: 1, z: 2 } },
  ];

  const updateSetting = <K extends keyof CameraSettings>(
    key: K,
    value: CameraSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onCameraChange(newSettings);
  };

  const applyPreset = (preset: { name: string; position: { x: number; y: number; z: number } }) => {
    const newSettings = {
      ...settings,
      position: preset.position,
      preset: preset.name,
    };
    setSettings(newSettings);
    onCameraChange(newSettings);
  };

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📷</span>
          <span className="text-sm font-semibold text-white">Camera Control</span>
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
          {/* Camera Presets */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Quick Angles</label>
            <div className="grid grid-cols-4 gap-2">
              {cameraPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`p-2 rounded-lg transition text-xs ${
                    settings.preset === preset.name
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                  title={preset.name}
                >
                  <div className="text-lg">{preset.icon}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Field of View */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Field of View: {settings.fov}°
            </label>
            <input
              type="range"
              min="20"
              max="120"
              value={settings.fov}
              onChange={(e) => updateSetting("fov", parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Telephoto</span>
              <span>Wide</span>
            </div>
          </div>

          {/* Camera Position */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Camera Position</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">X:</span>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={settings.position.x}
                  onChange={(e) =>
                    updateSetting("position", {
                      ...settings.position,
                      x: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-orange-500"
                />
                <span className="text-xs text-white font-mono w-8 text-right">
                  {settings.position.x.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">Y:</span>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={settings.position.y}
                  onChange={(e) =>
                    updateSetting("position", {
                      ...settings.position,
                      y: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-cyan-500"
                />
                <span className="text-xs text-white font-mono w-8 text-right">
                  {settings.position.y.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">Z:</span>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={settings.position.z}
                  onChange={(e) =>
                    updateSetting("position", {
                      ...settings.position,
                      z: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-purple-500"
                />
                <span className="text-xs text-white font-mono w-8 text-right">
                  {settings.position.z.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const reset = {
                  ...settings,
                  position: { x: 5, y: 3, z: 5 },
                  fov: 50,
                  preset: "default",
                };
                setSettings(reset);
                onCameraChange(reset);
              }}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
            >
              🔄 Reset
            </button>
            <button
              onClick={() => {
                // Save current view
                localStorage.setItem("savedCameraView", JSON.stringify(settings));
              }}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
            >
              💾 Save View
            </button>
          </div>

          {/* Camera Info */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="text-white font-mono">
                  {Math.sqrt(
                    settings.position.x ** 2 +
                    settings.position.y ** 2 +
                    settings.position.z ** 2
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Angle:</span>
                <span className="text-white font-mono">
                  {Math.round(
                    (Math.atan2(settings.position.z, settings.position.x) * 180) / Math.PI
                  )}°
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
