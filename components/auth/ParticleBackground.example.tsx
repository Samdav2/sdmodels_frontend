'use client';

import { useState } from 'react';
import ParticleBackground from './ParticleBackground';

/**
 * Example usage of ParticleBackground component
 * 
 * This component demonstrates both variants:
 * - Starfield: Futuristic connected particles with hover interaction
 * - Digital Rain: Matrix-style falling characters
 */
export default function ParticleBackgroundExample() {
  const [variant, setVariant] = useState<'starfield' | 'digitalRain'>('starfield');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Particle Background */}
      <ParticleBackground variant={variant} />

      {/* Demo Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-slate-900/50 backdrop-blur-md border-2 border-cyan-500/30 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            Particle Background Demo
          </h1>
          
          <p className="text-slate-300 mb-6 text-center">
            Choose a variant to see different particle effects
          </p>

          {/* Variant Selector */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setVariant('starfield')}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300
                ${variant === 'starfield'
                  ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              Starfield
            </button>
            <button
              onClick={() => setVariant('digitalRain')}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300
                ${variant === 'digitalRain'
                  ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              Digital Rain
            </button>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-cyan-400 font-semibold mb-2">
              {variant === 'starfield' ? 'Starfield Effect' : 'Digital Rain Effect'}
            </h3>
            <p className="text-slate-300 text-sm">
              {variant === 'starfield' 
                ? 'Connected particles with hover interaction. Optimized for desktop with 80 particles, reduced to 30 on mobile for performance.'
                : 'Matrix-style falling characters. Optimized with 100 particles on desktop, 40 on mobile for smooth animation.'
              }
            </p>
          </div>

          {/* Performance Note */}
          <div className="mt-4 text-center text-xs text-slate-400">
            <p>
              Particle count automatically adjusts based on screen size
            </p>
            <p className="mt-1">
              Current viewport: {typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Desktop'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
