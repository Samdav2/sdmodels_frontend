'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Model {
  id: string;
  name: string;
  polyCount: number;
}

interface GhostCompareModeProps {
  currentModel: Model;
  onCompareToggle: (compareModelId: string | null) => void;
}

export default function GhostCompareMode({ currentModel, onCompareToggle }: GhostCompareModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.5);

  // Mock available models for comparison
  const availableModels: Model[] = [
    { id: '2', name: 'Sci-Fi Character Rig', polyCount: 12500 },
    { id: '3', name: 'Futuristic Weapon', polyCount: 8200 },
    { id: '4', name: 'Neon City Props', polyCount: 15000 },
    { id: '5', name: 'Stylized Character', polyCount: 9800 },
  ];

  const handleCompare = (modelId: string) => {
    if (selectedModel === modelId) {
      // Deselect
      setSelectedModel(null);
      onCompareToggle(null);
    } else {
      // Select new model
      setSelectedModel(modelId);
      onCompareToggle(modelId);
    }
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    // In a real implementation, this would update the 3D viewer
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${
          selectedModel
            ? 'bg-red-500/30 border-red-500 text-red-300'
            : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
        }`}
      >
        <span className="text-xl">👻</span>
        Ghost-Compare
        {selectedModel && <span className="text-xs">(Active)</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-2 border-red-500/50 rounded-xl p-4 z-50 shadow-2xl max-h-96 overflow-y-auto"
          >
            {/* Current Model Info */}
            <div className="mb-4 p-3 bg-slate-950/50 border border-slate-700 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Current Model</div>
              <div className="font-semibold text-white">{currentModel.name}</div>
              <div className="text-sm text-gray-400 font-mono">
                {currentModel.polyCount.toLocaleString()} polys
              </div>
            </div>

            {/* Opacity Control */}
            {selectedModel && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <label className="block text-white font-semibold mb-2 text-sm">
                  Ghost Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Transparent</span>
                  <span>Opaque</span>
                </div>
              </div>
            )}

            {/* Model Selection */}
            <div className="mb-3">
              <label className="block text-white font-semibold mb-2 text-sm">
                Select Model to Compare
              </label>
              <div className="space-y-2">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleCompare(model.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedModel === model.id
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{model.name}</div>
                        <div className="text-xs text-gray-400 font-mono">
                          {model.polyCount.toLocaleString()} polys
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <span className="ml-2 text-red-400">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* View Options */}
            {selectedModel && (
              <div className="mb-3 p-3 bg-slate-950/50 border border-slate-700 rounded-lg">
                <div className="text-xs text-gray-400 mb-2">View Mode</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-xs font-semibold">
                    Wireframe
                  </button>
                  <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg text-xs hover:bg-slate-700">
                    Solid
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {selectedModel && (
                <button
                  onClick={() => {
                    setSelectedModel(null);
                    onCompareToggle(null);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:bg-slate-700 transition text-sm"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                {selectedModel ? 'Apply' : 'Close'}
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-300">
                👻 X-ray vision for 3D quality. Compare scale and topology of two models side-by-side.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
