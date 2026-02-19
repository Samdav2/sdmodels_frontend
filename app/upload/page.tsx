"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FileDropZone from "@/components/upload/FileDropZone";
import MeshSafetyScanner from "@/components/upload/MeshSafetyScanner";
import AITagSuggestions from "@/components/upload/AITagSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import { useUpload } from "@/lib/api/hooks/useUpload";
import { useRouter } from "next/navigation";

interface UploadedFile {
  file: File;
  preview?: string;
  status: "uploading" | "scanning" | "complete" | "error";
  meshData?: {
    polyCount: number;
    hasNGons: boolean;
    hasOpenEdges: boolean;
    hasUnappliedScales: boolean;
    riggingScore?: number;
    isProRig?: boolean;
  };
  optimizedVersion?: {
    polyCount: number;
    reduction: number;
  };
  neuralThumbnail?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { uploadModel, uploading, progress, error } = useUpload();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "scan" | "details" | "complete">("upload");
  const [optimizeMesh, setOptimizeMesh] = useState(false);
  const [generateThumbnail, setGenerateThumbnail] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    tags: [] as string[],
  });

  const handleFilesAdded = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      status: "uploading",
    }));
    setFiles(uploadedFiles);
    setCurrentStep("scan");

    // Simulate upload and scanning
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "scanning",
        }))
      );

      // Simulate mesh analysis with new features
      setTimeout(() => {
        const riggingScore = Math.floor(Math.random() * 30) + 70; // 70-100
        const originalPolyCount = Math.floor(Math.random() * 50000) + 5000;
        
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "complete",
            meshData: {
              polyCount: originalPolyCount,
              hasNGons: Math.random() > 0.7,
              hasOpenEdges: Math.random() > 0.8,
              hasUnappliedScales: Math.random() > 0.9,
              riggingScore: riggingScore,
              isProRig: riggingScore >= 85,
            },
            optimizedVersion: optimizeMesh ? {
              polyCount: Math.floor(originalPolyCount * 0.3),
              reduction: 70,
            } : undefined,
            neuralThumbnail: generateThumbnail ? "generated" : undefined,
          }))
        );
        setCurrentStep("details");
      }, 3000);
    }, 1500);
  };

  const handleOptimize = () => {
    setOptimizeMesh(true);
    // Trigger re-scan with optimization
    if (files.length > 0) {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          optimizedVersion: {
            polyCount: Math.floor((f.meshData?.polyCount || 10000) * 0.3),
            reduction: 70,
          },
        }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) return;
    
    // Upload to backend API
    const metadata = {
      ...formData,
      optimizeMesh,
      generateThumbnail,
      meshData: files[0].meshData,
    };
    
    const result = await uploadModel(files[0].file, metadata);
    
    if (result.success) {
      setCurrentStep("complete");
    } else {
      console.error("Upload failed:", error);
      // Show error notification
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardHeader
          title="⬆️ Upload Portal"
          description="Upload your 3D models and start earning"
          showBackButton={true}
        />

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
            {["upload", "scan", "details", "complete"].map((step, index) => {
              const isActive = currentStep === step;
              const isComplete = ["upload", "scan", "details", "complete"].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition text-sm sm:text-base ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                          : isComplete
                          ? "bg-green-500 text-white"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isComplete ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium capitalize ${
                        isActive ? "text-orange-400" : isComplete ? "text-green-400" : "text-slate-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 ${
                        isComplete ? "bg-green-500" : "bg-slate-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileDropZone onFilesAdded={handleFilesAdded} />
            </motion.div>
          )}

          {currentStep === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MeshSafetyScanner files={files} />
            </motion.div>
          )}

          {currentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Form */}
                  <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                      <h2 className="text-xl font-bold text-white mb-6">Model Details</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
                            placeholder="Cyberpunk Vehicle"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Price (USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                              $
                            </span>
                            <input
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              step="0.01"
                              min="0"
                              className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500 transition"
                              placeholder="29.99"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition resize-none"
                            placeholder="Describe your model..."
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mesh Info with Smart-Rig Validator */}
                    {files[0]?.meshData && (
                      <div className="space-y-4">
                        {/* Rigging Health Score */}
                        {files[0].meshData.riggingScore !== undefined && (
                          <div className="bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">🦴</span>
                                Smart-Rig Validator
                              </h3>
                              {files[0].meshData.isProRig && (
                                <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded-full text-xs font-bold">
                                  ✓ PRO-RIG
                                </span>
                              )}
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-slate-400">Rigging Health Score</span>
                                  <span className={`font-bold ${
                                    files[0].meshData.riggingScore >= 85 ? "text-green-400" :
                                    files[0].meshData.riggingScore >= 70 ? "text-yellow-400" : "text-red-400"
                                  }`}>
                                    {files[0].meshData.riggingScore}/100
                                  </span>
                                </div>
                                <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      files[0].meshData.riggingScore >= 85 ? "bg-green-500" :
                                      files[0].meshData.riggingScore >= 70 ? "bg-yellow-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${files[0].meshData.riggingScore}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-slate-400">
                                {files[0].meshData.isProRig ? (
                                  <p className="text-green-400">✓ Bones correctly named for Unity/Unreal. Weight painting is optimal.</p>
                                ) : (
                                  <p className="text-yellow-400">⚠ Some bones may need renaming for engine compatibility.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* AI Mesh Optimizer */}
                        <div className="bg-slate-900/50 border border-green-500/30 rounded-xl p-6 backdrop-blur">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <span className="text-2xl">🤖</span>
                              AI Mesh Optimizer
                            </h3>
                          </div>
                          {files[0].optimizedVersion ? (
                            <div className="space-y-3">
                              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-300">Original</span>
                                  <span className="text-sm font-mono text-white">
                                    {files[0].meshData.polyCount.toLocaleString()} polys
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-green-400 font-semibold">Optimized</span>
                                  <span className="text-sm font-mono text-green-400 font-bold">
                                    {files[0].optimizedVersion.polyCount.toLocaleString()} polys (-{files[0].optimizedVersion.reduction}%)
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400">
                                ✓ Both versions will be available: High-poly for film, Low-poly for games.
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-slate-400 mb-4">
                                Reduce poly count by 70% while preserving details. Perfect for mobile and game optimization.
                              </p>
                              <button
                                type="button"
                                onClick={handleOptimize}
                                className="w-full px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition font-semibold"
                              >
                                Optimize for Mobile
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Neural Thumbnail Generator */}
                        <div className="bg-slate-900/50 border border-yellow-500/30 rounded-xl p-6 backdrop-blur">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <span className="text-2xl">📸</span>
                              Neural Thumbnails
                            </h3>
                            {files[0].neuralThumbnail && (
                              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-full text-xs font-bold">
                                ✓ GENERATED
                              </span>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="aspect-video bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 flex items-center justify-center">
                              <span className="text-4xl">🎬</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {files[0].neuralThumbnail ? (
                                "✓ AI-generated cinematic lighting applied. Your thumbnail looks professional!"
                              ) : (
                                "AI will generate a cinematic thumbnail with professional lighting automatically."
                              )}
                            </p>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={generateThumbnail}
                                onChange={(e) => setGenerateThumbnail(e.target.checked)}
                                className="w-4 h-4 accent-yellow-500"
                              />
                              <span className="text-sm text-slate-300">Auto-generate cinematic thumbnail</span>
                            </label>
                          </div>
                        </div>

                        {/* Standard Mesh Analysis */}
                        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                          <h3 className="text-lg font-bold text-white mb-4">Mesh Analysis</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-400">Poly Count</span>
                              <span className="text-sm font-mono text-white">
                                {files[0].meshData.polyCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-400">N-gons</span>
                              <span
                                className={`text-sm font-medium ${
                                  files[0].meshData.hasNGons ? "text-yellow-400" : "text-green-400"
                                }`}
                              >
                                {files[0].meshData.hasNGons ? "⚠ Found" : "✓ Clean"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-400">Open Edges</span>
                              <span
                                className={`text-sm font-medium ${
                                  files[0].meshData.hasOpenEdges ? "text-yellow-400" : "text-green-400"
                                }`}
                              >
                                {files[0].meshData.hasOpenEdges ? "⚠ Found" : "✓ Clean"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-400">Unapplied Scales</span>
                              <span
                                className={`text-sm font-medium ${
                                  files[0].meshData.hasUnappliedScales ? "text-yellow-400" : "text-green-400"
                                }`}
                              >
                                {files[0].meshData.hasUnappliedScales ? "⚠ Found" : "✓ Clean"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - AI Tags */}
                  <div>
                    <AITagSuggestions
                      fileName={files[0]?.file.name || ""}
                      onTagsChange={(tags: string[]) => setFormData({ ...formData, tags })}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("upload")}
                    className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50"
                  >
                    Publish Model
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-slate-900/50 border border-green-500/30 rounded-xl p-12 backdrop-blur max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-6xl">✓</span>
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">Upload Complete!</h2>
                <p className="text-slate-300 mb-8">
                  Your model has been successfully uploaded and is now live on the marketplace.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setCurrentStep("upload");
                      setFormData({ name: "", price: "", description: "", tags: [] });
                    }}
                    className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
