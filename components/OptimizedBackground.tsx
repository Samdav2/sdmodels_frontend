"use client";

import { useEffect, useState } from 'react';
import { getPerformanceMode } from '@/lib/deviceDetection';

export default function OptimizedBackground() {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    setPerformanceMode(getPerformanceMode());
  }, []);

  // Low-end devices: Simple gradient
  if (performanceMode === 'low') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
    );
  }

  // Medium devices: Gradient with subtle pattern
  if (performanceMode === 'medium') {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />
      </div>
    );
  }

  // High-end devices: Full effects
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
    </div>
  );
}
