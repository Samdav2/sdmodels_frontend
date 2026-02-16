"use client";

import { useState } from "react";

interface Model {
  name: string;
  artist: string;
  artistVerified: boolean;
  price: number;
  platformFee: number;
  description: string;
  triangles: number;
  isRigged: boolean;
  textureSets: string[];
  formats: string[];
}

interface SpecsPanelProps {
  model: Model;
  onBuyClick?: () => void;
  onAddToCollection?: () => void;
  onAILighting?: () => void;
  onColorCustomizer?: () => void;
  onARMode?: () => void;
}

export default function SpecsPanel({ 
  model,
  onBuyClick,
  onAddToCollection,
  onAILighting,
  onColorCustomizer,
  onARMode,
}: SpecsPanelProps) {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isInCollection, setIsInCollection] = useState(false);

  const handleBuyClick = () => {
    if (onBuyClick) {
      onBuyClick();
    } else {
      // Trigger buy modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('openBuyModal', {
          detail: { model }
        }));
      }
    }
  };

  const handleAddToCollection = () => {
    setIsInCollection(!isInCollection);
    if (onAddToCollection) {
      onAddToCollection();
    } else {
      // Trigger notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            type: 'success',
            title: isInCollection ? 'Removed from Collection' : 'Added to Collection',
            message: isInCollection 
              ? `${model.name} has been removed from your collection.`
              : `${model.name} has been added to your collection!`,
            autoClose: 3000,
          }
        }));
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Asset Title & Artist */}
      <div>
        <h1 className="text-3xl font-black text-white mb-3 leading-tight">
          {model.name}
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-semibold">{model.artist}</span>
              {model.artistVerified && (
                <span className="text-orange-400" title="Verified Creator">✓</span>
              )}
            </div>
            <div className="text-xs text-gray-500">Professional Creator</div>
          </div>
        </div>
      </div>

      {/* Price Hub */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-sm text-gray-400 mb-1">PRICE</div>
            <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              ${model.price}
            </div>
          </div>
          <button 
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            className="text-gray-400 hover:text-orange-400 transition" 
            title="Price Breakdown"
          >
            ℹ️
          </button>
        </div>
        
        {showPriceBreakdown && (
          <div className="text-xs text-gray-400 space-y-1 mb-4 bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span className="text-white">${(model.price - model.platformFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee (7.5%):</span>
              <span className="text-orange-400">${model.platformFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-orange-500/20 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-white">${model.price.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleBuyClick}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-black text-lg shadow-lg shadow-orange-500/50 hover:scale-105 transform"
        >
          🛒 BUY NOW
        </button>
        
        <button 
          onClick={handleAddToCollection}
          className={`w-full mt-3 py-3 border rounded-xl transition font-semibold ${
            isInCollection
              ? "bg-orange-500/20 border-orange-500 text-orange-400"
              : "bg-slate-800 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
          }`}
        >
          {isInCollection ? "✓ In Collection" : "❤️ Add to Collection"}
        </button>
      </div>

      {/* Technical Data Readout */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-5 backdrop-blur">
        <div className="text-sm font-bold text-orange-400 mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>TECHNICAL SPECS</span>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Triangles:</span>
            <span className="text-white font-mono font-semibold">{model.triangles.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Rigging:</span>
            <span className={`font-semibold ${model.isRigged ? "text-green-400" : "text-gray-500"}`}>
              {model.isRigged ? "✓ Yes" : "✗ No"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Texture Sets:</span>
            <span className="text-white font-semibold">4K PBR</span>
          </div>
          
          <div className="pt-2 border-t border-orange-500/20">
            <div className="text-gray-400 mb-2">Texture Maps:</div>
            <div className="flex flex-wrap gap-1">
              {model.textureSets.map((tex) => (
                <span 
                  key={tex}
                  className="px-2 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded text-xs"
                >
                  {tex}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* File Formats */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-5 backdrop-blur">
        <div className="text-sm font-bold text-orange-400 mb-4 flex items-center gap-2">
          <span>📦</span>
          <span>FILE FORMATS</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {model.formats.map((format) => (
            <div 
              key={format}
              className="px-3 py-2 bg-slate-900 border border-orange-500/30 rounded-lg text-center"
            >
              <div className="text-orange-400 font-bold text-lg">.{format.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-3">
        <button 
          onClick={() => {
            if (onAILighting) {
              onAILighting();
            } else {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showNotification', {
                  detail: {
                    type: 'info',
                    title: 'AI Lighting Assistant',
                    message: 'Analyzing scene... Recommended: Studio lighting with 1.2x intensity for optimal model visibility.',
                    actions: [
                      {
                        label: 'Apply Studio',
                        onClick: () => {
                          window.dispatchEvent(new CustomEvent('applyAILighting', {
                            detail: {
                              preset: 'studio',
                              intensity: 1.2,
                              keyLightColor: '#ffffff',
                              fillLightColor: '#ff8c42',
                              rimLightColor: '#ffa552',
                            }
                          }));
                          window.dispatchEvent(new CustomEvent('showNotification', {
                            detail: {
                              type: 'success',
                              title: 'Lighting Applied!',
                              message: 'Studio lighting preset has been applied to your scene.',
                              autoClose: 3000,
                            }
                          }));
                        },
                        variant: 'primary',
                      },
                      {
                        label: 'Close',
                        onClick: () => {},
                        variant: 'secondary',
                      },
                    ],
                  }
                }));
              }
            }
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 rounded-xl hover:bg-purple-500/30 transition font-semibold flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>AI Lighting Assistant</span>
        </button>
        
        <button 
          onClick={() => {
            if (onColorCustomizer) {
              onColorCustomizer();
            } else {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showNotification', {
                  detail: {
                    type: 'info',
                    title: 'Color Customizer',
                    message: 'Use the Material Swapper below to customize colors. Choose from presets or use the color picker for custom colors!',
                    autoClose: 4000,
                  }
                }));
              }
            }
          }}
          className="w-full py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition font-semibold flex items-center justify-center gap-2"
        >
          <span>🎨</span>
          <span>Color Customizer</span>
        </button>
        
        <button 
          onClick={() => {
            if (onARMode) {
              onARMode();
            } else {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showNotification', {
                  detail: {
                    type: 'info',
                    title: 'AR Hologram Mode',
                    message: 'Preparing AR preview... Point your camera at a flat surface.',
                    autoClose: 4000,
                  }
                }));
              }
            }
          }}
          className="w-full py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-300 rounded-xl hover:bg-green-500/30 transition font-semibold flex items-center justify-center gap-2"
        >
          <span>📱</span>
          <span>AR Hologram Mode</span>
        </button>
      </div>

      {/* Download Specs */}
      <button
        onClick={() => {
          const specs = {
            model: {
              name: model.name,
              artist: model.artist,
              price: model.price,
              platformFee: model.platformFee,
              description: model.description,
            },
            technical: {
              triangles: model.triangles,
              isRigged: model.isRigged,
              textureSets: model.textureSets,
              formats: model.formats,
            },
            exportInfo: {
              exportDate: new Date().toISOString(),
              exportedBy: 'HWC3D Platform',
              version: '1.0.0',
            },
          };
          
          const json = JSON.stringify(specs, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${model.name.replace(/\s+/g, '_')}_specs_${Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('showNotification', {
              detail: {
                type: 'success',
                title: 'Specs Downloaded!',
                message: `Model specifications saved as: ${link.download}`,
                autoClose: 3000,
              }
            }));
          }
        }}
        className="w-full py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 text-orange-300 rounded-xl hover:bg-orange-500/30 transition font-semibold flex items-center justify-center gap-2"
      >
        <span>📥</span>
        <span>Download Specs (JSON)</span>
      </button>

      {/* License Info */}
      <div className="bg-slate-800/30 border border-orange-500/10 rounded-xl p-4">
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex items-start gap-2">
            <span>✓</span>
            <span>Commercial use allowed</span>
          </div>
          <div className="flex items-start gap-2">
            <span>✓</span>
            <span>Unlimited projects</span>
          </div>
          <div className="flex items-start gap-2">
            <span>✓</span>
            <span>Lifetime updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
