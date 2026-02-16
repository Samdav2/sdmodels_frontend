"use client";

import { useEffect, useState } from "react";

const stats = [
  "🔥 1,200+ Models Uploaded This Week",
  "⚡ 500+ Active Animators Online",
  "🎨 2,500+ Assets Sold Today",
  "✨ 150+ New Creators Joined",
  "🏆 10,000+ Quality Certified Models",
];

export default function LiveStatsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <span className="animate-pulse">📊</span>
          <div className="font-semibold text-sm md:text-base transition-all duration-500">
            {stats[currentIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}
