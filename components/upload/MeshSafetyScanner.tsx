"use client";

import { motion } from "framer-motion";

interface UploadedFile {
  file: File;
  status: "uploading" | "scanning" | "complete" | "error";
  meshData?: {
    polyCount: number;
    hasNGons: boolean;
    hasOpenEdges: boolean;
    hasUnappliedScales: boolean;
  };
}

interface MeshSafetyScannerProps {
  files: UploadedFile[];
}

export default function MeshSafetyScanner({ files }: MeshSafetyScannerProps) {
  const file = files[0];
  if (!file) return null;

  const isScanning = file.status === "uploading" || file.status === "scanning";
  const progress = file.status === "uploading" ? 33 : file.status === "scanning" ? 66 : 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-8 backdrop-blur">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isScanning ? "Analyzing Your Model..." : "Analysis Complete"}
        </h2>

        {/* File Info */}
        <div className="mb-8 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white">{file.file.name}</div>
              <div className="text-sm text-slate-400">
                {(file.file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">
              {file.status === "uploading"
                ? "Uploading..."
                : file.status === "scanning"
                ? "Scanning Mesh..."
                : "Complete"}
            </span>
            <span className="text-sm font-mono text-orange-400">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="relative h-4 bg-slate-950/50 rounded-lg overflow-hidden border border-slate-700/50">
            {/* Animated Progress */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 relative"
              style={{
                boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)",
              }}
            >
              {/* Scanning Line Effect */}
              {isScanning && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Scanning Checks */}
        <div className="space-y-4">
          {[
            {
              label: "Uploading File",
              status: progress >= 33 ? "complete" : "loading",
              icon: "📤",
            },
            {
              label: "Analyzing Geometry",
              status: progress >= 66 ? "complete" : progress >= 33 ? "loading" : "pending",
              icon: "🔍",
            },
            {
              label: "Checking Mesh Health",
              status: progress >= 100 ? "complete" : progress >= 66 ? "loading" : "pending",
              icon: "✅",
            },
          ].map((check, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg"
            >
              <span className="text-2xl">{check.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{check.label}</div>
              </div>
              <div>
                {check.status === "complete" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400 text-xl"
                  >
                    ✓
                  </motion.span>
                )}
                {check.status === "loading" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
                  />
                )}
                {check.status === "pending" && (
                  <span className="text-slate-600 text-xl">○</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mesh Data Results */}
        {file.meshData && file.status === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-slate-950/50 border border-green-500/30 rounded-lg"
          >
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>✓</span>
              Mesh Analysis Complete
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Poly Count</div>
                <div className="text-xl font-bold text-white">
                  {file.meshData.polyCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">N-gons</div>
                <div
                  className={`text-xl font-bold ${
                    file.meshData.hasNGons ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {file.meshData.hasNGons ? "⚠ Found" : "✓ Clean"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Open Edges</div>
                <div
                  className={`text-xl font-bold ${
                    file.meshData.hasOpenEdges ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {file.meshData.hasOpenEdges ? "⚠ Found" : "✓ Clean"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Unapplied Scales</div>
                <div
                  className={`text-xl font-bold ${
                    file.meshData.hasUnappliedScales ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {file.meshData.hasUnappliedScales ? "⚠ Found" : "✓ Clean"}
                </div>
              </div>
            </div>

            {(file.meshData.hasNGons || file.meshData.hasOpenEdges || file.meshData.hasUnappliedScales) && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-400">
                  ⚠ Some issues detected. Your model will still be published, but fixing these issues may improve quality.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
