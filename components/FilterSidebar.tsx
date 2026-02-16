"use client";

interface FilterSidebarProps {
  filters: {
    category: string;
    polyCount: string;
    formats: string[];
    animationReady: boolean;
  };
  setFilters: (filters: any) => void;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const categories = [
    "All",
    "3D Models",
    "2D Sprites",
    "Rigged Characters",
    "Environment Assets",
    "Props",
    "VFX",
  ];

  const polyCounts = [
    { label: "All", value: "all" },
    { label: "Low Poly (< 5K)", value: "low" },
    { label: "Medium (5K-15K)", value: "medium" },
    { label: "High Poly (> 15K)", value: "high" },
  ];

  const formats = ["GLB", "FBX", "OBJ", "BLEND", "USD"];

  const licenses = ["Commercial", "Personal", "Editorial"];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          🎯 Filters
        </h3>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-orange-400 font-semibold mb-3 text-sm">CATEGORY</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat.toLowerCase() })}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                filters.category === cat.toLowerCase()
                  ? "bg-orange-500/30 text-orange-400 border border-orange-500/50"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Poly Count */}
      <div>
        <h4 className="text-orange-400 font-semibold mb-3 text-sm">POLY COUNT</h4>
        <div className="space-y-2">
          {polyCounts.map((poly) => (
            <button
              key={poly.value}
              onClick={() => setFilters({ ...filters, polyCount: poly.value })}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                filters.polyCount === poly.value
                  ? "bg-orange-500/30 text-orange-400 border border-orange-500/50"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {poly.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Format */}
      <div>
        <h4 className="text-orange-400 font-semibold mb-3 text-sm">FILE FORMAT</h4>
        <div className="space-y-2">
          {formats.map((format) => (
            <label key={format} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.formats.includes(format)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({ ...filters, formats: [...filters.formats, format] });
                  } else {
                    setFilters({
                      ...filters,
                      formats: filters.formats.filter((f) => f !== format),
                    });
                  }
                }}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-gray-400 group-hover:text-white transition">{format}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Animation Ready Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-orange-400 font-semibold text-sm">ANIMATION READY</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.animationReady}
              onChange={(e) => setFilters({ ...filters, animationReady: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-12 h-6 rounded-full transition ${
                filters.animationReady ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                  filters.animationReady ? "translate-x-6" : "translate-x-1"
                } mt-0.5`}
              />
            </div>
          </div>
        </label>
      </div>

      {/* License Type */}
      <div>
        <h4 className="text-orange-400 font-semibold mb-3 text-sm">LICENSE</h4>
        <div className="space-y-2">
          {licenses.map((license) => (
            <label key={license} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 accent-orange-500" />
              <span className="text-gray-400 group-hover:text-white transition">{license}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          setFilters({
            category: "all",
            polyCount: "all",
            formats: [],
            animationReady: false,
          })
        }
        className="w-full px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-semibold"
      >
        Reset Filters
      </button>
    </div>
  );
}
