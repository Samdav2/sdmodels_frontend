"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ARVRViewerProps {
  modelId: string;
  modelName: string;
}

export default function ARVRViewer({ modelId, modelName }: ARVRViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"ar" | "vr" | null>(null);

  const launchAR = () => {
    setActiveMode("ar");
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: 'AR Mode Ready!',
          message: `Viewing "${modelName}" in AR. In production, this would launch AR Quick Look (iOS) or Scene Viewer (Android).`,
          actions: [
            {
              label: 'Learn More',
              onClick: () => {
                window.dispatchEvent(new CustomEvent('showNotification', {
                  detail: {
                    type: 'info',
                    title: 'AR Implementation',
                    message: 'AR requires: 1) USDZ file for iOS ARKit, 2) GLB file for Android ARCore, 3) Model Viewer web component or native AR APIs.',
                    autoClose: 8000,
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
  };

  const launchVR = () => {
    setActiveMode("vr");
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: 'VR Mode Ready!',
          message: `Viewing "${modelName}" in VR. In production, this would open a VR-optimized viewer with stereoscopic rendering.`,
          actions: [
            {
              label: 'Learn More',
              onClick: () => {
                window.dispatchEvent(new CustomEvent('showNotification', {
                  detail: {
                    type: 'info',
                    title: 'VR Implementation',
                    message: 'VR requires: 1) WebXR API support, 2) VR headset connected, 3) Stereoscopic camera setup, 4) Controller input handling.',
                    autoClose: 8000,
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
  };

  const launchWebXR = () => {
    if (typeof window !== 'undefined') {
      // Check if WebXR is supported
      if ('xr' in navigator) {
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            type: 'success',
            title: 'WebXR Supported!',
            message: 'Your browser supports WebXR. In production, this would enter immersive VR mode with your connected headset.',
            actions: [
              {
                label: 'Start VR Session',
                onClick: () => {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'info',
                      title: 'VR Session Starting...',
                      message: 'Put on your VR headset. Use controllers to interact with the model. Press menu button to exit.',
                      autoClose: 5000,
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
      } else {
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            type: 'error',
            title: 'WebXR Not Supported',
            message: 'Your browser doesn\'t support WebXR. Try Chrome or Edge with a VR headset connected, or use a WebXR-compatible browser.',
            autoClose: 6000,
          }
        }));
      }
    }
  };

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🥽</span>
          <span className="text-sm font-semibold text-white">AR / VR Viewer</span>
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
          {/* AR Mode */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📱</span>
              <div>
                <h4 className="text-white font-bold">Augmented Reality</h4>
                <p className="text-xs text-gray-400">View in your real space</p>
              </div>
            </div>
            
            <button
              onClick={launchAR}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-400 hover:to-emerald-400 transition font-semibold"
            >
              🚀 Launch AR Mode
            </button>

            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <div>• Point camera at flat surface</div>
              <div>• Tap to place model</div>
              <div>• Pinch to scale, drag to rotate</div>
            </div>
          </div>

          {/* VR Mode */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🥽</span>
              <div>
                <h4 className="text-white font-bold">Virtual Reality</h4>
                <p className="text-xs text-gray-400">Immersive 360° experience</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={launchWebXR}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-400 hover:to-pink-400 transition font-semibold"
              >
                🎮 Launch WebXR (Desktop VR)
              </button>

              <button
                onClick={launchVR}
                className="w-full py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 border border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500/30 transition font-semibold"
              >
                📱 Mobile VR
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <div>• Supports Oculus, Vive, Index</div>
              <div>• 6DOF tracking</div>
              <div>• Controller interaction</div>
            </div>
          </div>

          {/* Quick Share */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2 font-semibold">Quick Share</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/model/${modelId}?mode=ar`;
                  navigator.clipboard.writeText(url);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('showNotification', {
                      detail: {
                        type: 'success',
                        title: 'Link Copied!',
                        message: 'AR link copied to clipboard. Share this link to view the model in AR on mobile devices.',
                        autoClose: 3000,
                      }
                    }));
                  }
                }}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                📋 Copy AR Link
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/model/${modelId}?mode=vr`;
                  navigator.clipboard.writeText(url);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('showNotification', {
                      detail: {
                        type: 'success',
                        title: 'Link Copied!',
                        message: 'VR link copied to clipboard. Open this link in a WebXR-compatible browser with VR headset.',
                        autoClose: 3000,
                      }
                    }));
                  }
                }}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
              >
                📋 Copy VR Link
              </button>
            </div>
          </div>

          {/* Device Compatibility */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-2 font-semibold">
              📱 Device Compatibility
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>✓ iOS 12+ (ARKit)</div>
              <div>✓ Android 7+ (ARCore)</div>
              <div>✓ Oculus Quest 1/2/3</div>
              <div>✓ HTC Vive / Valve Index</div>
              <div>✓ Windows Mixed Reality</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
