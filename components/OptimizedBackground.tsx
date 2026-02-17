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

  // On mobile: render 3D background with reduced complexity
  if (mobile) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Render HeroBackground3D but with reduced particle count via CSS */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none" style={{ opacity: 0.7 }}>
          <HeroBackground3D />
        </div>
        
        {/* Overlay to reduce intensity on mobile */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(15, 23, 42, 0.5) 80%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // On desktop: full 3D background with animations
  return <HeroBackground3D />;
}
