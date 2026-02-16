"use client";

import Link from "next/link";

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    price: number;
    polyCount: number;
    thumbnail: string;
    formats: string[];
    isRigged?: boolean;
    isNew?: boolean;
    isHot?: boolean;
    category?: string;
  };
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/model/${model.id}`}>
      <div className="group bg-slate-800/50 backdrop-blur border-2 border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/30 transition-all cursor-pointer hover:scale-105">
        {/* Thumbnail with overlay */}
        <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
          {/* Animated gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {model.isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                NEW
              </span>
            )}
            {model.isHot && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                🔥 HOT
              </span>
            )}
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-3 text-xs text-white">
              <div className="flex items-center gap-1">
                <span>📐</span>
                <span>{(model.polyCount / 1000).toFixed(1)}K</span>
              </div>
              {model.isRigged && (
                <div className="flex items-center gap-1">
                  <span>🎭</span>
                  <span>Rigged</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>📦</span>
                <span>{model.formats.length} formats</span>
              </div>
            </div>
          </div>

          {/* Placeholder 3D preview text */}
          <div className="relative z-10">
            <div className="text-orange-400/50 text-sm group-hover:text-orange-400 transition">
              🎮 Hover to Preview
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 bg-slate-900/50">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition line-clamp-1">
              {model.name}
            </h3>
          </div>

          <p className="text-sm text-gray-400 mb-3">
            <span className="text-orange-400 font-semibold">
              {model.polyCount.toLocaleString()}
            </span>{" "}
            polygons
          </p>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              ${model.price}
            </span>
            <div className="flex gap-1">
              {model.formats.slice(0, 3).map((format) => (
                <span
                  key={format}
                  className="text-xs bg-orange-500/20 border border-orange-500/40 text-orange-400 px-2 py-1 rounded font-semibold"
                >
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-sm">
              Quick View
            </button>
            <button className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
