"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TopologyHealthScanProps {
  onModeChange: (mode: "normal" | "heatmap" | "uv" | "clay") => void;
}

export default function TopologyHealthScan({ onModeChange }: TopologyHealthScanProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"normal" | "heatmap" | "uv" | "clay">("normal");
  
  // Mock topology data - in real app, this comes from backend analysis
  const topologyData = {
    totalFaces: 45200,
    quads: 42890,
    tris: 2100,
    ngons: 210,
    integrityScore: 94.8,
    uvOverlaps: 0,
    nonManifoldEdges: 0,
  };

  const handleModeChange = (mode: "normal" | "heatmap" | "uv" | "clay") => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-400";
    if (score >= 85) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
  };

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🔬</span>
          <span className="text-sm font-semibold text-white">Topology Health Scan</span>
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
          {/* Mesh Integrity Score */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Mesh Integrity Score</span>
              <span className={`text-3xl font-black ${getScoreColor(topologyData.integrityScore)}`}>
                {getScoreGrade(topologyData.integrityScore)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topologyData.integrityScore}%` }}
                  className={`h-full ${
                    topologyData.integrityScore >= 95
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : topologyData.integrityScore >= 85
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className={`text-lg font-bold ${getScoreColor(topologyData.integrityScore)}`}>
                {topologyData.integrityScore}%
              </span>
            </div>
          </div>

          {/* View Modes */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Inspection Modes</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeChange("normal")}
                className={`p-3 rounded-lg transition ${
                  activeMode === "normal"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                <div className="text-2xl mb-1">👁️</div>
                <div className="text-xs font-semibold">Normal</div>
              </button>

              <button
                onClick={() => handleModeChange("heatmap")}
                className={`p-3 rounded-lg transition ${
                  activeMode === "heatmap"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xs font-semibold">Heatmap</div>
              </button>

              <button
                onClick={() => handleModeChange("uv")}
                className={`p-3 rounded-lg transition ${
                  activeMode === "uv"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                <div className="text-2xl mb-1">🗺️</div>
                <div className="text-xs font-semibold">UV Map</div>
              </button>

              <button
                onClick={() => handleModeChange("clay")}
                className={`p-3 rounded-lg transition ${
                  activeMode === "clay"
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                <div className="text-2xl mb-1">🎭</div>
                <div className="text-xs font-semibold">Clay</div>
              </button>
            </div>
          </div>

          {/* Topology Breakdown */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-3 font-semibold">Topology Breakdown</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-300">Quads (Good)</span>
                </div>
                <span className="text-white font-mono font-bold">
                  {topologyData.quads.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-300">Tris (OK)</span>
                </div>
                <span className="text-white font-mono font-bold">
                  {topologyData.tris.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-300">N-gons (Bad)</span>
                </div>
                <span className="text-red-400 font-mono font-bold">
                  {topologyData.ngons.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Faces</span>
                <span className="text-orange-400 font-mono font-bold">
                  {topologyData.totalFaces.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quality Checks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
              <span className="text-xs text-gray-400">UV Overlaps</span>
              <span className={`text-sm font-bold ${topologyData.uvOverlaps === 0 ? "text-green-400" : "text-red-400"}`}>
                {topologyData.uvOverlaps === 0 ? "✓ None" : `✗ ${topologyData.uvOverlaps}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
              <span className="text-xs text-gray-400">Non-Manifold Edges</span>
              <span className={`text-sm font-bold ${topologyData.nonManifoldEdges === 0 ? "text-green-400" : "text-red-400"}`}>
                {topologyData.nonManifoldEdges === 0 ? "✓ None" : `✗ ${topologyData.nonManifoldEdges}`}
              </span>
            </div>
          </div>

          {/* Heatmap Legend */}
          {activeMode === "heatmap" && (
            <div className="bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2 font-semibold">Heatmap Legend</div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-300">Clean Quads</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-300">Triangles</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-300">N-gons</span>
                </div>
              </div>
            </div>
          )}

          {/* UV Map Info */}
          {activeMode === "uv" && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="text-xs text-purple-300 mb-2 font-semibold">
                🗺️ UV Map Inspector
              </div>
              <div className="text-xs text-gray-400">
                Click any part of the model to see its UV coordinates. Green areas = efficient packing, Red areas = wasted space.
              </div>
            </div>
          )}

          {/* Export Report */}
          <button
            onClick={() => {
              const report = {
                integrityScore: topologyData.integrityScore,
                grade: getScoreGrade(topologyData.integrityScore),
                topology: topologyData,
                timestamp: new Date().toISOString(),
              };
              const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `topology-report-${Date.now()}.json`;
              a.click();
            }}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
          >
            💾 Export Health Report
          </button>
        </motion.div>
      )}
    </div>
  );
}
