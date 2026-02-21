"use client";

import { useEffect, useState, memo, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer to avoid SSR issues
const Real3DModelViewer = dynamic(() => import('./Real3DModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

interface ModelPreviewProps {
  file: File | null;
  modelName: string;
  price: string;
  description: string;
  category: string;
  tags: string[];
  polyCount?: number;
}

// Memoize the entire component to prevent unnecessary re-renders
const ModelPreview = memo(function ModelPreview({
  file,
  modelName,
  price,
  description,
  category,
  tags,
  polyCount,
}: ModelPreviewProps) {
  const fileFormat = useMemo(() => {
    return file ? file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN' : '';
  }, [file]);

  const fileSizeMB = useMemo(() => {
    return file ? (file.size / 1024 / 1024).toFixed(2) : '0';
  }, [file]);

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-2 border-orange-500/50 rounded-2xl p-6 backdrop-blur shadow-xl shadow-orange-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <span className="text-2xl">👁️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Model Preview</h2>
          <p className="text-sm text-slate-400">Live 3D preview of your model</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3D Preview */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden relative border border-slate-700">
            <Real3DModelViewer file={file} />
            {file && (
              <>
                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-xs font-bold rounded pointer-events-none z-10">
                  3D Preview
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/90 text-slate-300 text-xs rounded pointer-events-none z-10">
                  {fileFormat}
                </div>
              </>
            )}
          </div>

          {/* File Info */}
          {file && (
            <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">File Name:</span>
                <span className="text-white font-mono truncate ml-2 max-w-[150px]" title={file.name}>
                  {file.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">File Size:</span>
                <span className="text-white font-mono">{fileSizeMB} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Format:</span>
                <span className="text-white font-mono">{fileFormat}</span>
              </div>
            </div>
          )}
        </div>

        {/* Marketplace Preview */}
        <div className="space-y-3">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="mb-3">
              <div className="text-xs text-slate-500 mb-1">Category</div>
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-400 text-sm rounded-full inline-block">
                {category}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 min-h-[28px]">
              {modelName || "Model Name"}
            </h3>

            <p className="text-sm text-slate-400 line-clamp-3 mb-3 min-h-[60px]">
              {description || "Model description will appear here..."}
            </p>

            <div className="flex items-center gap-3 mb-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg flex-1">
                <div className="text-xs text-green-400 mb-1">Price</div>
                <div className="text-xl font-bold text-white">
                  ${price || "0.00"}
                </div>
              </div>

              {polyCount && polyCount > 0 && (
                <div className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg flex-1">
                  <div className="text-xs text-purple-400 mb-1">Polys</div>
                  <div className="text-lg font-bold text-white">
                    {polyCount.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 4 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
                    +{tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-2">Controls</div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Left click + drag to rotate</p>
              <p>• Right click + drag to pan</p>
              <p>• Scroll to zoom in/out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModelPreview;