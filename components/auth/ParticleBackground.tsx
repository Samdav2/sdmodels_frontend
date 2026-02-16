'use client';

import { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine, ISourceOptions } from 'tsparticles-engine';

interface ParticleBackgroundProps {
  variant?: 'starfield' | 'digitalRain';
}

export default function ParticleBackground({ 
  variant = 'starfield' 
}: ParticleBackgroundProps) {
  // Initialize particles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Detect mobile devices for performance optimization
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Starfield configuration
  const starfieldOptions: ISourceOptions = useMemo(() => ({
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: isMobile ? 30 : 80,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#ffffff', '#ff6b35', '#ff8c42'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#ff6b35',
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: isMobile ? 0.5 : 1,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: !isMobile,
          mode: 'grab',
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    detectRetina: true,
  }), [isMobile]);

  // Digital Rain configuration (Matrix-style)
  const digitalRainOptions: ISourceOptions = useMemo(() => ({
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: isMobile ? 40 : 100,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#00ff41', '#00d936', '#00b32c'],
      },
      shape: {
        type: 'char',
        options: {
          char: {
            value: ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ'],
            font: 'monospace',
            style: '',
            weight: '400',
          },
        },
      },
      opacity: {
        value: { min: 0.2, max: 0.8 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      size: {
        value: { min: 8, max: 16 },
      },
      move: {
        enable: true,
        speed: isMobile ? 2 : 4,
        direction: 'bottom',
        straight: true,
        outModes: {
          default: 'out',
          bottom: 'out',
          top: 'none',
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        resize: true,
      },
    },
    detectRetina: true,
  }), [isMobile]);

  const options = variant === 'digitalRain' ? digitalRainOptions : starfieldOptions;

  return (
    <div 
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    >
      <Particles
        id="particle-background"
        init={particlesInit}
        options={options}
      />
    </div>
  );
}
