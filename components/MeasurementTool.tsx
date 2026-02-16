"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MeasurementToolProps {
  modelDimensions: { width: number; height: number; depth: number };
}

export default function MeasurementTool({ modelDimensions }: MeasurementToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<"meters" | "centimeters" | "feet" | "inches">("meters");
  const [showBoundingBox, setShowBoundingBox] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const convertUnit = (value: number) => {
    switch (unit) {
      case "centimeters":
        return (value * 100).toFixed(2);
      case "feet":
        return (value * 3.28084).toFixed(2);
      case "inches":
        return (value * 39.3701).toFixed(2);
      default:
        return value.toFixed(2);
    }
  };

  const getUnitSymbol = () => {
    switch (unit) {
      case "centimeters":
        return "cm";
      case "feet":
        return "ft";
      case "inches":
        return "in";
      default:
        return "m";
    }
  };

  const volume =
    modelDimensions.width * modelDimensions.height * modelDimensions.depth;

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📏</span>
          <span className="text-sm font-semibold text-white">Measurements</span>
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
          {/* Unit Selector */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Unit</label>
            <div className="grid grid-cols-4 gap-2">
              {(["meters", "centimeters", "feet", "inches"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`py-2 rounded-lg transition text-xs ${
                    unit === u
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {u === "meters" && "m"}
                  {u === "centimeters" && "cm"}
                  {u === "feet" && "ft"}
                  {u === "inches" && "in"}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-3">Model Dimensions</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-sm text-gray-300">Width (X)</span>
                </div>
                <span className="text-white font-mono font-bold">
                  {convertUnit(modelDimensions.width)} {getUnitSymbol()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                  <span className="text-sm text-gray-300">Height (Y)</span>
                </div>
                <span className="text-white font-mono font-bold">
                  {convertUnit(modelDimensions.height)} {getUnitSymbol()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-300">Depth (Z)</span>
                </div>
                <span className="text-white font-mono font-bold">
                  {convertUnit(modelDimensions.depth)} {getUnitSymbol()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">Volume</span>
                <span className="text-orange-400 font-mono font-bold">
                  {convertUnit(volume)} {getUnitSymbol()}³
                </span>
              </div>
            </div>
          </div>

          {/* Visual Aids */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Visual Aids</label>
            <div className="space-y-2">
              <button
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`w-full py-2 rounded-lg transition text-sm ${
                  showBoundingBox
                    ? "bg-orange-500 text-white"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {showBoundingBox ? "📦 Bounding Box ON" : "📦 Bounding Box OFF"}
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-full py-2 rounded-lg transition text-sm ${
                  showGrid
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {showGrid ? "#️⃣ Measurement Grid ON" : "#️⃣ Measurement Grid OFF"}
              </button>
            </div>
          </div>

          {/* Scale Reference */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-2 font-semibold">
              📐 Scale Reference
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Average human height: ~1.7m (5.6ft)</div>
              <div>• Door height: ~2.0m (6.6ft)</div>
              <div>• Car length: ~4.5m (14.8ft)</div>
            </div>
          </div>

          {/* Export Measurements */}
          <button
            onClick={() => {
              const data = {
                dimensions: {
                  width: `${convertUnit(modelDimensions.width)} ${getUnitSymbol()}`,
                  height: `${convertUnit(modelDimensions.height)} ${getUnitSymbol()}`,
                  depth: `${convertUnit(modelDimensions.depth)} ${getUnitSymbol()}`,
                  volume: `${convertUnit(volume)} ${getUnitSymbol()}³`,
                },
                unit: unit,
                timestamp: new Date().toISOString(),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `model-measurements-${Date.now()}.json`;
              a.click();
            }}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
          >
            💾 Export Measurements
          </button>
        </motion.div>
      )}
    </div>
  );
}
