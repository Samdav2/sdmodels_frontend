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

  // On mobile: simpler background for better performance
  if (mobile) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />
      </div>
    );
  }

  // On desktop: full 3D background with animations
  return <HeroBackground3D />;
}
