'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MaterialSwapperProps {
  onMaterialChange: (material: { color?: string; texture?: string }) => void;
}

export default function MaterialSwapper({ onMaterialChange }: MaterialSwapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ff6b35');
  const [uploadedTexture, setUploadedTexture] = useState<string | null>(null);

  const presetColors = [
    { name: 'Orange', value: '#ff6b35' },
    { name: 'Red', value: '#cc0044' },
    { name: 'Cyan', value: '#00d9ff' },
    { name: 'Purple', value: '#9d4edd' },
    { name: 'Green', value: '#00ff88' },
    { name: 'Gold', value: '#ffd700' },
    { name: 'Silver', value: '#c0c0c0' },
    { name: 'Black', value: '#1a1a1a' },
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onMaterialChange({ color });
    
    // Show notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: 'Material Updated!',
          message: `Model color changed to ${color}. See the changes in real-time!`,
          autoClose: 2000,
        }
      }));
    }
  };

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const texture = event.target?.result as string;
        setUploadedTexture(texture);
        onMaterialChange({ texture });
        
        // Show notification
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showNotification', {
            detail: {
              type: 'success',
              title: 'Texture Uploaded!',
              message: `Custom texture applied to model. This is a preview - purchase to get full resolution.`,
              autoClose: 3000,
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-purple-500/20 border-2 border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition font-semibold flex items-center justify-center gap-2"
      >
        <span className="text-xl">🎨</span>
        Material Swapper
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-xl p-4 z-50 shadow-2xl"
          >
            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2 text-sm">
                Base Color
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`h-10 rounded-lg border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-white scale-110'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              
              {/* Custom Color Input */}
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-slate-800 border border-slate-700"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-500"
                  placeholder="#ff6b35"
                />
              </div>
            </div>

            {/* Texture Upload */}
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2 text-sm">
                Custom Texture
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTextureUpload}
                  className="hidden"
                  id="texture-upload"
                />
                <label
                  htmlFor="texture-upload"
                  className="block w-full px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg text-gray-400 text-center cursor-pointer hover:border-purple-500 hover:text-purple-400 transition"
                >
                  {uploadedTexture ? (
                    <span className="text-purple-400">✓ Texture Uploaded</span>
                  ) : (
                    <span>Click to upload texture map</span>
                  )}
                </label>
              </div>
              {uploadedTexture && (
                <div className="mt-2 relative h-20 rounded-lg overflow-hidden border border-slate-700">
                  <img
                    src={uploadedTexture}
                    alt="Uploaded texture"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedColor('#ff6b35');
                  setUploadedTexture(null);
                  onMaterialChange({ color: '#ff6b35' });
                }}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:bg-slate-700 transition text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm font-semibold"
              >
                Apply
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-xs text-purple-300">
                💡 Changes are applied in real-time. See how the model looks in your palette before buying!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
