"use client";

import { useEffect, useState } from 'react';
import { isMobile } from '@/lib/deviceDetection';
import HeroBackground3D from './HeroBackground3D';

export default function OptimizedBackground() {
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMobile(isMobile());
  }, []);

  // Don't render anything on server
  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      </div>
    );
  }

  // On mobile: optimized background with lighter animations
  if (mobile) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Radial gradient overlay - lighter on mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        
        {/* Optimized grid pattern - smaller and lighter */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />
        
        {/* Lighter radial mask for mobile */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(15, 23, 42, 0.7) 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // On desktop: full 3D background with animations
  return <HeroBackground3D />;
}
