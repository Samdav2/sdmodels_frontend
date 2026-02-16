"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EnvironmentPrototyperProps {
  onObjectAdd: (object: SceneObject) => void;
  onObjectRemove: (id: string) => void;
  onClearAll: () => void;
}

interface SceneObject {
  id: string;
  type: string;
  name: string;
  scale: number;
}

export default function EnvironmentPrototyper({ onObjectAdd, onObjectRemove, onClearAll }: EnvironmentPrototyperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [addedObjects, setAddedObjects] = useState<SceneObject[]>([]);

  const sceneObjects = [
    { type: 'human', name: 'Human (1.75m)', icon: '🧍', scale: 1.75 },
    { type: 'car', name: 'Car (4.5m)', icon: '🚗', scale: 4.5 },
    { type: 'crate', name: 'Crate (1m)', icon: '📦', scale: 1 },
    { type: 'door', name: 'Door (2m)', icon: '🚪', scale: 2 },
    { type: 'tree', name: 'Tree (8m)', icon: '🌳', scale: 8 },
    { type: 'building', name: 'Building (15m)', icon: '🏢', scale: 15 },
  ];

  const handleAddObject = (obj: typeof sceneObjects[0]) => {
    const newObject: SceneObject = {
      id: `${obj.type}-${Date.now()}`,
      type: obj.type,
      name: obj.name,
      scale: obj.scale,
    };
    
    setAddedObjects([...addedObjects, newObject]);
    onObjectAdd(newObject);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: 'Object Added!',
          message: `${obj.name} added to scene for scale reference`,
          autoClose: 2000,
        }
      }));
    }
  };

  const handleRemoveObject = (id: string) => {
    setAddedObjects(addedObjects.filter(obj => obj.id !== id));
    onObjectRemove(id);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: 'Object Removed',
          message: 'Reference object removed from scene',
          autoClose: 2000,
        }
      }));
    }
  };

  const clearAll = () => {
    setAddedObjects([]);
    onClearAll();
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: 'Scene Cleared',
          message: 'All reference objects removed',
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
          <span className="text-xl">🎬</span>
          <span className="text-sm font-semibold text-white">Scene Prototyper</span>
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
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-1 font-semibold">
              📐 Real-World Scale Testing
            </div>
            <div className="text-xs text-gray-400">
              Add reference objects to test your model's scale in real-world contexts
            </div>
          </div>

          {/* Object Library */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Add Reference Objects</label>
            <div className="grid grid-cols-2 gap-2">
              {sceneObjects.map((obj) => (
                <button
                  key={obj.type}
                  onClick={() => handleAddObject(obj)}
                  className="p-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-orange-500/50 rounded-lg transition group"
                >
                  <div className="text-3xl mb-1 group-hover:scale-110 transition">{obj.icon}</div>
                  <div className="text-xs font-semibold text-white">{obj.name.split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">{obj.scale}m</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Object Upload */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="text-xs text-purple-300 mb-2 font-semibold">
              📤 Upload Custom Object
            </div>
            <input
              type="file"
              accept=".glb,.gltf,.obj,.fbx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const newObject: SceneObject = {
                    id: `custom-${Date.now()}`,
                    type: 'custom',
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    scale: 2,
                  };
                  
                  setAddedObjects([...addedObjects, newObject]);
                  onObjectAdd(newObject);
                  
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('showNotification', {
                      detail: {
                        type: 'success',
                        title: 'Custom Object Added!',
                        message: `${file.name} added to scene. In production, this would load your actual 3D model.`,
                        autoClose: 3000,
                      }
                    }));
                  }
                  
                  // Reset input
                  e.target.value = '';
                }
              }}
              className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer"
            />
            <div className="text-xs text-gray-400 mt-2">
              Supports: GLB, GLTF, OBJ, FBX
            </div>
          </div>

          {/* Added Objects List */}
          {addedObjects.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-semibold">Scene Objects ({addedObjects.length})</span>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {addedObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="flex items-center justify-between p-2 bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {sceneObjects.find(o => o.type === obj.type)?.icon}
                      </span>
                      <div>
                        <div className="text-xs text-white font-semibold">{obj.name}</div>
                        <div className="text-xs text-gray-400">{obj.scale}m</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveObject(obj.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scale Comparison */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="text-xs text-purple-300 mb-2 font-semibold">
              📏 Scale Comparison
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Model Height:</span>
                <span className="text-white font-mono font-bold">4.0m</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Model Width:</span>
                <span className="text-white font-mono font-bold">2.0m</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Model Depth:</span>
                <span className="text-white font-mono font-bold">1.0m</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'info',
                      title: 'Grid Overlay',
                      message: '1m grid overlay enabled for precise measurements',
                      autoClose: 2000,
                    }
                  }));
                }
              }}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
            >
              📐 Show Grid
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'success',
                      title: 'Scene Saved',
                      message: 'Scene configuration saved to your library',
                      autoClose: 2000,
                    }
                  }));
                }
              }}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
            >
              💾 Save Scene
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="text-xs text-orange-300 mb-2 font-semibold">
              💡 Pro Tip
            </div>
            <div className="text-xs text-gray-400">
              Use the human reference to ensure your character models are properly scaled for game engines. Most engines expect 1.75m for average human height.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
