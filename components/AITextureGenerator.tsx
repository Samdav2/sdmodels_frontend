"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AITextureGeneratorProps {
  onTextureSelect: (textureId: string) => void;
}

export default function AITextureGenerator({ onTextureSelect }: AITextureGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [mode, setMode] = useState<'gallery' | 'ai'>('gallery');
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);

  // Texture gallery with preview colors
  const textures = [
    { 
      id: 'rusty-metal', 
      name: 'Rusty Metal', 
      icon: '🔩', 
      color: '#8B4513',
      desc: 'Weathered metal with rust'
    },
    { 
      id: 'worn-leather', 
      name: 'Worn Leather', 
      icon: '🧥', 
      color: '#654321',
      desc: 'Aged leather with creases'
    },
    { 
      id: 'polished-gold', 
      name: 'Polished Gold', 
      icon: '✨', 
      color: '#FFD700',
      desc: 'Shiny gold material'
    },
    { 
      id: 'weathered-stone', 
      name: 'Weathered Stone', 
      icon: '🗿', 
      color: '#808080',
      desc: 'Ancient stone texture'
    },
    { 
      id: 'neon-circuits', 
      name: 'Neon Circuits', 
      icon: '⚡', 
      color: '#00FFFF',
      desc: 'Glowing tech patterns'
    },
    { 
      id: 'ancient-wood', 
      name: 'Ancient Wood', 
      icon: '🪵', 
      color: '#8B7355',
      desc: 'Old wooden planks'
    },
    { 
      id: 'carbon-fiber', 
      name: 'Carbon Fiber', 
      icon: '🏎️', 
      color: '#1a1a1a',
      desc: 'High-tech composite'
    },
    { 
      id: 'chrome', 
      name: 'Chrome', 
      icon: '💿', 
      color: '#E5E4E2',
      desc: 'Reflective chrome finish'
    },
  ];

  const handleTextureSelect = (texture: typeof textures[0]) => {
    setSelectedTexture(texture.id);
    onTextureSelect(texture.id);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: 'Texture Applied!',
          message: `${texture.name} texture applied to model. This is a preview - purchase to get full resolution PBR maps.`,
          autoClose: 3000,
        }
      }));
    }
  };

  const clearTexture = () => {
    setSelectedTexture(null);
    onTextureSelect('');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: 'Texture Cleared',
          message: 'Original material restored',
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
          <span className="text-xl">🎨</span>
          <span className="text-sm font-semibold text-white">Texture Gallery</span>
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
          {/* Mode Toggle */}
          <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
            <button
              onClick={() => setMode('gallery')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                mode === 'gallery'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎨 Gallery
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                mode === 'ai'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🤖 AI Generate
            </button>
          </div>

          {mode === 'gallery' ? (
            <>
              {/* Info Banner */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="text-xs text-purple-300 mb-1 font-semibold">
                  🎨 Professional Textures
                </div>
                <div className="text-xs text-gray-400">
                  Click any texture to preview on the model. Purchase to get full 4K PBR maps.
                </div>
              </div>

          {/* Texture Gallery Grid */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Available Textures</label>
            <div className="grid grid-cols-2 gap-2">
              {textures.map((texture) => (
                <button
                  key={texture.id}
                  onClick={() => handleTextureSelect(texture)}
                  className={`relative p-3 rounded-lg transition group overflow-hidden ${
                    selectedTexture === texture.id
                      ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/50"
                      : "hover:ring-2 hover:ring-orange-500/50"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${texture.color}40, ${texture.color}20)`,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: selectedTexture === texture.id ? '#ff6b35' : `${texture.color}60`
                  }}
                >
                  {/* Color Preview Circle */}
                  <div 
                    className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white/30 shadow-lg"
                    style={{ backgroundColor: texture.color }}
                  />
                  
                  <div className="text-3xl mb-2 group-hover:scale-110 transition">{texture.icon}</div>
                  <div className="text-xs font-semibold text-white mb-1">{texture.name}</div>
                  <div className="text-xs text-gray-300">{texture.desc}</div>
                  
                  {selectedTexture === texture.id && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ✓ Active
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Texture Info */}
          {selectedTexture && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white/30"
                    style={{ backgroundColor: textures.find(t => t.id === selectedTexture)?.color }}
                  />
                  <div>
                    <div className="text-sm text-white font-semibold">
                      {textures.find(t => t.id === selectedTexture)?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      Currently Applied
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearTexture}
                  className="text-xs text-red-400 hover:text-red-300 transition px-3 py-1 bg-red-500/10 rounded-lg"
                >
                  Clear
                </button>
              </div>
              
              {/* Texture Maps Info */}
              <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-slate-700">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="text-white font-mono">4096x4096</span>
                </div>
                <div className="flex justify-between">
                  <span>Maps Included:</span>
                  <span className="text-white font-mono">5 PBR</span>
                </div>
              </div>
            </div>
          )}

          {/* PBR Maps Info */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-2 font-semibold">
              📦 Full PBR Package Includes
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>✓ Diffuse / Albedo Map (4K)</div>
              <div>✓ Normal Map (4K)</div>
              <div>✓ Roughness Map (4K)</div>
              <div>✓ Metallic Map (4K)</div>
              <div>✓ Ambient Occlusion (4K)</div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-xs text-yellow-300 mb-2 font-semibold">
              💰 Texture Pricing
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>• Preview:</span>
                <span className="text-green-400 font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>• Single Texture:</span>
                <span className="text-white font-bold">$9.99</span>
              </div>
              <div className="flex justify-between">
                <span>• Full PBR Set:</span>
                <span className="text-white font-bold">$24.99</span>
              </div>
              <div className="flex justify-between">
                <span>• Commercial License:</span>
                <span className="text-white font-bold">+$15.00</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          {selectedTexture && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'info',
                      title: 'Purchase Texture',
                      message: `Ready to purchase ${textures.find(t => t.id === selectedTexture)?.name} PBR set for $24.99?`,
                      actions: [
                        {
                          label: 'Buy Now',
                          onClick: () => {
                            window.dispatchEvent(new CustomEvent('showNotification', {
                              detail: {
                                type: 'success',
                                title: 'Purchase Successful!',
                                message: 'Texture pack downloaded to your library. Check your email for the download link.',
                                autoClose: 5000,
                              }
                            }));
                          },
                          variant: 'primary',
                        },
                        {
                          label: 'Cancel',
                          onClick: () => {},
                          variant: 'secondary',
                        },
                      ],
                    }
                  }));
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-sm hover:from-orange-400 hover:to-red-400 transition"
            >
              💳 Purchase Full PBR Set - $24.99
            </button>
          )}

          {/* Instructions */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="text-xs text-orange-300 mb-2 font-semibold">
              💡 Pro Tips
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Preview textures instantly on the model</div>
              <div>• All textures are 4K resolution PBR</div>
              <div>• Compatible with all major game engines</div>
              <div>• Commercial license available for projects</div>
            </div>
          </div>
            </>
          ) : (
            <>
              {/* AI Generation Mode */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="text-xs text-purple-300 mb-1 font-semibold">
                  🤖 AI Texture Generation
                </div>
                <div className="text-xs text-gray-400">
                  Describe your texture and let AI create it for you!
                </div>
              </div>

              {/* AI Prompt Input */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Describe Your Texture</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., 'rusty metal with scratches and dents, weathered by time'"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                  disabled={isGenerating}
                />
              </div>

              {/* AI Style Selection */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">AI Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'realistic', name: 'Realistic', icon: '📸' },
                    { id: 'stylized', name: 'Stylized', icon: '🎨' },
                    { id: 'pbr', name: 'PBR', icon: '💎' },
                    { id: 'cartoon', name: 'Cartoon', icon: '🎭' },
                    { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
                    { id: 'fantasy', name: 'Fantasy', icon: '✨' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setAiStyle(style.id)}
                      disabled={isGenerating}
                      className={`p-2 rounded-lg transition text-xs ${
                        aiStyle === style.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      } disabled:opacity-50`}
                    >
                      <div className="text-xl mb-1">{style.icon}</div>
                      <div className="font-semibold">{style.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={() => {
                  if (!aiPrompt.trim()) {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('showNotification', {
                        detail: {
                          type: 'warning',
                          title: 'Prompt Required',
                          message: 'Please describe the texture you want to generate',
                          autoClose: 2000,
                        }
                      }));
                    }
                    return;
                  }

                  setIsGenerating(true);
                  
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('showNotification', {
                      detail: {
                        type: 'exporting',
                        title: 'Generating Texture...',
                        message: `AI is creating your ${aiStyle} texture`,
                        progress: 0,
                      }
                    }));

                    let progress = 0;
                    const interval = setInterval(() => {
                      progress += 10;
                      if (progress <= 100) {
                        window.dispatchEvent(new CustomEvent('showNotification', {
                          detail: {
                            type: 'exporting',
                            title: 'Generating Texture...',
                            message: `AI is creating your ${aiStyle} texture`,
                            progress,
                          }
                        }));
                      } else {
                        clearInterval(interval);
                        setIsGenerating(false);
                        
                        // Apply a random texture from gallery as preview
                        const randomTexture = textures[Math.floor(Math.random() * textures.length)];
                        setSelectedTexture(randomTexture.id);
                        onTextureSelect(randomTexture.id);
                        
                        window.dispatchEvent(new CustomEvent('showNotification', {
                          detail: {
                            type: 'success',
                            title: 'Texture Generated!',
                            message: 'AI texture preview applied. Purchase to get full resolution PBR maps.',
                            autoClose: 4000,
                          }
                        }));
                      }
                    }, 300);
                  }
                }}
                disabled={isGenerating || !aiPrompt.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                  isGenerating
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isGenerating ? '🎨 Generating...' : '✨ Generate Texture'}
              </button>

              {/* AI Info */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-300 mb-2 font-semibold">
                  🤖 AI Generation Info
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Generation time: ~30 seconds</div>
                  <div>• Creates full PBR texture set</div>
                  <div>• Preview is free, purchase for full res</div>
                  <div>• Powered by Stable Diffusion XL</div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
