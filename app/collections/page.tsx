"use client";

import Link from "next/link";
import { useState } from "react";

export default function CollectionsPage() {
  const collections = [
    { id: 1, name: "Game Assets", description: "My favorite game-ready models", count: 24, thumbnail: "🎮", isPublic: true },
    { id: 2, name: "Favorites", description: "Models I love", count: 15, thumbnail: "⭐", isPublic: false },
    { id: 3, name: "Inspiration", description: "For future projects", count: 32, thumbnail: "💡", isPublic: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Dashboard</span>
          </Link>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold">
            + New Collection
          </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">My Collections</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`} className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition group">
              <div className="text-6xl mb-4">{collection.thumbnail}</div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-400 transition">{collection.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{collection.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{collection.count} models</span>
                <span className={`px-2 py-1 rounded-full text-xs ${collection.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {collection.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
