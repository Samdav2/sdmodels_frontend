"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

const SUPPORTED_FORMATS = [".glb", ".gltf", ".fbx", ".obj", ".blend", ".max"];

export default function FileDropZone({ onFilesAdded }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) =>
      SUPPORTED_FORMATS.some((format) => file.name.toLowerCase().endsWith(format))
    );

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesAdded(selectedFiles);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-8 backdrop-blur">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Upload Your 3D Model
        </h2>

        {/* Drop Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? "rgba(255, 107, 53, 0.8)" : "rgba(255, 107, 53, 0.3)",
            backgroundColor: isDragging ? "rgba(255, 107, 53, 0.1)" : "rgba(15, 23, 42, 0.5)",
          }}
          className="relative border-2 border-dashed rounded-xl p-12 text-center transition"
        >
          {/* Teleport Animation Effect */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icon */}
          <motion.div
            animate={{
              scale: isDragging ? 1.2 : 1,
              rotate: isDragging ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            📦
          </motion.div>

          {/* Text */}
          <h3 className="text-xl font-bold text-white mb-2">
            {isDragging ? "Drop to Teleport Data" : "Drag & Drop Your Files"}
          </h3>
          <p className="text-slate-400 mb-6">
            or click to browse
          </p>

          {/* File Input */}
          <input
            type="file"
            multiple
            accept={SUPPORTED_FORMATS.join(",")}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Supported Formats */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SUPPORTED_FORMATS.map((format) => (
              <span
                key={format}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-400"
              >
                {format}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Selected Files */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3"
            >
              <h4 className="text-sm font-semibold text-slate-300">Selected Files:</h4>
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <div className="text-sm font-medium text-white">{file.name}</div>
                      <div className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}

              {/* Upload Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpload}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50"
              >
                Start Upload & Analysis
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-orange-400 mb-1">
                Multi-Format Processing
              </h4>
              <p className="text-xs text-slate-300">
                Upload .blend or .max files and we'll automatically convert them to .glb, .fbx, and .obj formats using headless Blender.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
