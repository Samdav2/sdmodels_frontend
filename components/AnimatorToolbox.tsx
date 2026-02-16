"use client";

import { useState } from "react";

interface AnimatorToolboxProps {
  animations: string[];
  isRigged: boolean;
  selectedAnimation: string | null;
  setSelectedAnimation: (anim: string | null) => void;
  viewerSettings: any;
  setViewerSettings: (settings: any) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  animationProgress: number;
  setAnimationProgress: (progress: number) => void;
  selectedPose: string | null;
  setSelectedPose: (pose: string | null) => void;
}

export default function AnimatorToolbox({
  animations,
  isRigged,
  selectedAnimation,
  setSelectedAnimation,
  viewerSettings,
  setViewerSettings,
  isPlaying,
  setIsPlaying,
  animationProgress,
  setAnimationProgress,
  selectedPose,
  setSelectedPose,
}: AnimatorToolboxProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const maxTime = 100; // Mock duration

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setSelectedPose(null); // Clear pose when playing animation
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleTimeChange = (time: number) => {
    setAnimationProgress(time);
  };
  
  const handlePoseClick = (pose: string) => {
    setSelectedAnimation(null);
    setIsPlaying(false);
    setAnimationProgress(0);
    setSelectedPose(pose);
    
    // Trigger pose application notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: `${pose} Applied!`,
          message: `Model is now in ${pose} position. Perfect for inspection and screenshots.`,
          autoClose: 2000,
        }
      }));
    }
  };

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-orange-400 mb-2">ANIMATOR'S TOOLBOX</div>
        <div className="text-2xl font-black text-white">🎬</div>
      </div>

      {/* Inspector Mode */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
        <div className="text-sm font-semibold text-white mb-3">Inspector Mode</div>
        <button
          onClick={() => setViewerSettings({ ...viewerSettings, showSkeleton: !viewerSettings.showSkeleton })}
          className={`w-full py-2 rounded-lg transition font-semibold text-sm ${
            viewerSettings.showSkeleton
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
          }`}
        >
          {viewerSettings.showSkeleton ? "🦴 Hide Skeleton" : "🦴 Show Skeleton"}
        </button>
      </div>

      {/* Animation Clips */}
      {isRigged && (
        <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
          <div className="text-sm font-semibold text-white mb-3">
            Animation Clips
            {selectedAnimation && (
              <span className="ml-2 text-xs text-orange-400">({animations.length} available)</span>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {animations.map((anim) => (
              <button
                key={anim}
                onClick={() => {
                  setSelectedAnimation(anim === selectedAnimation ? null : anim);
                  setIsPlaying(false);
                  setAnimationProgress(0);
                  setSelectedPose(null); // Clear pose when selecting animation
                }}
                className={`w-full px-3 py-2 rounded-lg transition text-sm text-left flex items-center justify-between ${
                  selectedAnimation === anim
                    ? "bg-orange-500 text-white font-semibold shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                <span>▶ {anim}</span>
                {selectedAnimation === anim && isPlaying && (
                  <span className="text-xs animate-pulse">Playing...</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Animation Timeline */}
      {selectedAnimation && (
        <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
          <div className="text-sm font-semibold text-white mb-3">
            Timeline
            <span className="ml-2 text-xs text-gray-400">({selectedAnimation})</span>
          </div>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max={maxTime}
              value={animationProgress}
              onChange={(e) => handleTimeChange(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{Math.floor(animationProgress / 30)}:{String(Math.floor((animationProgress % 30) * 2)).padStart(2, '0')}</span>
              <span className="text-orange-400 font-mono">{animationProgress}%</span>
              <span>{Math.floor(maxTime / 30)}:{String(Math.floor((maxTime % 30) * 2)).padStart(2, '0')}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleTimeChange(0)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition"
                title="Reset to start"
              >
                ⏮
              </button>
              <button 
                onClick={handlePlayPause}
                className={`flex-1 py-2 text-white rounded-lg text-xs transition font-semibold ${
                  isPlaying 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button 
                onClick={() => handleTimeChange(maxTime)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition"
                title="Skip to end"
              >
                ⏭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pose Library */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
        <div className="text-sm font-semibold text-white mb-3">Quick Poses</div>
        <div className="grid grid-cols-2 gap-2">
          {["T-Pose", "A-Pose", "Crouch", "Combat"].map((pose) => (
            <button 
              key={pose}
              onClick={() => handlePoseClick(pose)}
              className={`py-2 rounded-lg text-xs transition font-semibold ${
                selectedPose === pose
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-slate-700 text-gray-300 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {pose}
            </button>
          ))}
        </div>
      </div>

      {/* Playback Speed */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
        <div className="text-sm font-semibold text-white mb-3">
          Playback Speed
          <span className="ml-2 text-orange-400 font-mono text-xs">{playbackSpeed.toFixed(2)}x</span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0.25x</span>
            <span className={playbackSpeed === 1 ? "text-orange-400 font-semibold" : ""}>1.0x</span>
            <span>2.0x</span>
          </div>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`py-1 rounded text-xs transition ${
                  playbackSpeed === speed
                    ? "bg-orange-500 text-white font-semibold"
                    : "bg-slate-700 text-gray-400 hover:bg-slate-600"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
        <div className="text-sm font-semibold text-white mb-3">Export</div>
        <div className="space-y-2">
          <button 
            onClick={() => {
              // Trigger recording notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('startRecording', {
                  detail: { animation: selectedAnimation, duration: 5000 }
                }));
              }
            }}
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition hover:text-white font-semibold"
          >
            🎥 Record Animation (5s)
          </button>
          <button 
            onClick={() => {
              // Trigger export notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('exportAnimation', {
                  detail: { animation: selectedAnimation, format: 'fbx' }
                }));
              }
            }}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition hover:text-white font-semibold"
          >
            💾 Export to FBX
          </button>
          <button 
            onClick={() => {
              // Trigger export notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('exportAnimation', {
                  detail: { animation: selectedAnimation, format: 'gltf' }
                }));
              }
            }}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition hover:text-white font-semibold"
          >
            💾 Export to GLTF
          </button>
        </div>
      </div>
    </div>
  );
}
