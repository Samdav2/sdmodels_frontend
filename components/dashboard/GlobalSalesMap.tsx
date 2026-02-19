"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";

// Mock sales data by country/region
const salesData = [
  { region: "United States", country: "US", lat: 37.09, lon: -95.71, sales: 285, color: "#ff6b35" },
  { region: "United Kingdom", country: "GB", lat: 55.38, lon: -3.44, sales: 142, color: "#ff8c42" },
  { region: "Germany", country: "DE", lat: 51.17, lon: 10.45, sales: 98, color: "#ffa552" },
  { region: "Japan", country: "JP", lat: 36.20, lon: 138.25, sales: 156, color: "#ffbe62" },
  { region: "China", country: "CN", lat: 35.86, lon: 104.20, sales: 124, color: "#ffd772" },
  { region: "Canada", country: "CA", lat: 56.13, lon: -106.35, sales: 78, color: "#ff7b45" },
  { region: "Australia", country: "AU", lat: -25.27, lon: 133.78, sales: 95, color: "#ff9c52" },
  { region: "France", country: "FR", lat: 46.23, lon: 2.21, sales: 87, color: "#ffac62" },
  { region: "Brazil", country: "BR", lat: -14.24, lon: -51.93, sales: 65, color: "#ffbc72" },
  { region: "India", country: "IN", lat: 20.59, lon: 78.96, sales: 112, color: "#ffcc82" },
];

function Globe() {
  // Convert lat/lon to 3D coordinates
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      {/* Main Globe */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Inner Glow */}
      <Sphere args={[1.95, 32, 32]}>
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Sales Markers */}
      {salesData.map((data, index) => {
        const position = latLonToVector3(data.lat, data.lon, 2.1);
        const size = 0.05 + (data.sales / 500) * 0.12;

        return (
          <group key={index} position={position}>
            {/* Marker Sphere */}
            <Sphere args={[size, 16, 16]}>
              <meshBasicMaterial color={data.color} />
            </Sphere>
            
            {/* Pulsing Ring */}
            <Sphere args={[size * 1.5, 16, 16]}>
              <meshBasicMaterial
                color={data.color}
                transparent
                opacity={0.3}
                wireframe
              />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
}

export default function GlobalSalesMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"globe" | "list">("globe");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort by sales descending
  const sortedData = [...salesData].sort((a, b) => b.sales - a.sales);
  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-slate-950/50 rounded-lg border border-orange-500/20 flex items-center justify-center">
        <div className="text-orange-400 animate-pulse">Loading Map...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🌍 Global Sales Distribution</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("globe")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              viewMode === "globe"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            🌐 Globe
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              viewMode === "list"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            📊 List
          </button>
        </div>
      </div>

      {viewMode === "globe" ? (
        <>
          {/* 3D Globe */}
          <div className="w-full h-[350px] sm:h-[400px] bg-slate-950/50 rounded-lg overflow-hidden border border-orange-500/20">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Globe />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minDistance={3}
                maxDistance={8}
              />
            </Canvas>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {sortedData.slice(0, 5).map((data, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-slate-900/50 border transition cursor-pointer ${
                  hoveredRegion === data.region
                    ? "border-orange-500/70 shadow-lg shadow-orange-500/20"
                    : "border-slate-700/50 hover:border-orange-500/50"
                }`}
                onMouseEnter={() => setHoveredRegion(data.region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-slate-400 truncate">{data.region}</div>
                  <div className="text-xs sm:text-sm font-bold text-white">{data.sales}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* List View */
        <div className="bg-slate-950/50 rounded-lg border border-orange-500/20 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/50 border-b border-slate-800 text-xs sm:text-sm font-semibold text-slate-400">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 sm:col-span-6">Country</div>
            <div className="col-span-3 sm:col-span-2 text-right">Sales</div>
            <div className="col-span-3 sm:col-span-3 text-right">Share</div>
          </div>

          {/* Country List */}
          <div className="max-h-[400px] overflow-y-auto">
            {sortedData.map((data, index) => {
              const percentage = ((data.sales / totalSales) * 100).toFixed(1);
              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 p-3 sm:p-4 border-b border-slate-800/50 hover:bg-slate-900/30 transition group"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900" :
                      index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900" :
                      index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="col-span-5 sm:col-span-6 flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: data.color, boxShadow: `0 0 8px ${data.color}` }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-white truncate">
                        {data.region}
                      </div>
                      <div className="text-xs text-slate-500">{data.country}</div>
                    </div>
                  </div>

                  {/* Sales */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-bold text-orange-400">
                        {data.sales}
                      </div>
                      <div className="text-xs text-slate-500">sales</div>
                    </div>
                  </div>

                  {/* Percentage Bar */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-2">
                    <div className="hidden sm:block flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white w-12 text-right">
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/70 border-t border-orange-500/30">
            <div className="col-span-6 sm:col-span-7 flex items-center">
              <span className="text-sm sm:text-base font-bold text-white">Total</span>
            </div>
            <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
              <span className="text-sm sm:text-base font-bold text-orange-400">{totalSales}</span>
            </div>
            <div className="col-span-3 sm:col-span-3 flex items-center justify-end">
              <span className="text-sm sm:text-base font-bold text-white">100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
