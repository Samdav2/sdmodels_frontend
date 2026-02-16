"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";

// Mock sales data by region
const salesData = [
  { region: "North America", lat: 40, lon: -100, sales: 450, color: "#ff6b35" },
  { region: "Europe", lat: 50, lon: 10, sales: 320, color: "#ff8c42" },
  { region: "Asia", lat: 35, lon: 105, sales: 280, color: "#ffa552" },
  { region: "South America", lat: -15, lon: -60, sales: 120, color: "#ffbe62" },
  { region: "Australia", lat: -25, lon: 135, sales: 95, color: "#ffd772" },
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
        const size = 0.05 + (data.sales / 1000) * 0.15;

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-slate-950/50 rounded-lg border border-orange-500/20 flex items-center justify-center">
        <div className="text-orange-400 animate-pulse">Initializing Globe...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 3D Globe */}
      <div className="w-full h-[400px] bg-slate-950/50 rounded-lg overflow-hidden border border-orange-500/20">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Globe />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Sales Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {salesData.map((data, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30 border border-slate-700/50 hover:border-orange-500/50 transition cursor-pointer"
            onMouseEnter={() => setHoveredRegion(data.region)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}
            />
            <div className="flex-1">
              <div className="text-xs text-slate-400">{data.region}</div>
              <div className="text-sm font-bold text-white">{data.sales} sales</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
