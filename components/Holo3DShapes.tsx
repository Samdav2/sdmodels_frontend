"use client";

import { motion } from 'framer-motion';

export default function Holo3DShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large rotating wireframe cube */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 z-0"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Cube faces */}
          {[
            { transform: 'rotateY(0deg) translateZ(128px)', bg: 'from-orange-500/10' },
            { transform: 'rotateY(90deg) translateZ(128px)', bg: 'from-red-500/10' },
            { transform: 'rotateY(180deg) translateZ(128px)', bg: 'from-orange-500/10' },
            { transform: 'rotateY(-90deg) translateZ(128px)', bg: 'from-red-500/10' },
            { transform: 'rotateX(90deg) translateZ(128px)', bg: 'from-orange-500/10' },
            { transform: 'rotateX(-90deg) translateZ(128px)', bg: 'from-red-500/10' },
          ].map((face, i) => (
            <div
              key={i}
              className={`absolute w-full h-full border-2 border-orange-400/30 bg-gradient-to-br ${face.bg} to-transparent backdrop-blur-sm`}
              style={{ transform: face.transform }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating pyramid */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-48 h-48 z-0"
        animate={{
          rotateX: [0, 360],
          rotateZ: [0, 360],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Pyramid faces */}
          <div className="absolute w-0 h-0 border-l-[96px] border-r-[96px] border-b-[166px] border-l-transparent border-r-transparent border-b-red-500/20 backdrop-blur-sm" 
               style={{ transform: 'rotateX(0deg) translateZ(0px)', left: '0', top: '0' }} />
          <div className="absolute w-0 h-0 border-l-[96px] border-r-[96px] border-b-[166px] border-l-transparent border-r-transparent border-b-orange-500/20 backdrop-blur-sm" 
               style={{ transform: 'rotateY(90deg) translateZ(0px)', left: '0', top: '0' }} />
        </div>
      </motion.div>

      {/* Spinning torus */}
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-56 h-56 z-0"
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 180, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d62828" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="none" stroke="url(#torusGrad)" strokeWidth="20" opacity="0.6" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="url(#torusGrad)" strokeWidth="3" opacity="0.8" />
          <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="#ff8c42" strokeWidth="2" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Wireframe sphere */}
      <motion.div
        className="absolute top-2/3 right-1/3 w-40 h-40 z-0"
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="sphereGrad">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {/* Latitude lines */}
          {[30, 50, 70, 90, 110, 130, 150, 170].map((y, i) => (
            <ellipse
              key={`lat-${i}`}
              cx="100"
              cy="100"
              rx={Math.abs(100 - y) * 0.8}
              ry="10"
              fill="none"
              stroke="#ff8c42"
              strokeWidth="1"
              opacity="0.5"
              transform={`translate(0, ${y - 100})`}
            />
          ))}
          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((angle, i) => (
            <ellipse
              key={`lon-${i}`}
              cx="100"
              cy="100"
              rx="80"
              ry="80"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="1"
              opacity="0.5"
              transform={`rotate(${angle}, 100, 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" opacity="0.2" />
        </svg>
      </motion.div>

      {/* Floating vertices/points */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`vertex-${i}`}
          className="absolute w-2 h-2 z-0"
          style={{
            left: `${10 + (i * 4.5)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        >
          <div className="w-full h-full bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
          {/* Connection lines */}
          {i < 19 && (
            <svg className="absolute top-0 left-0 w-20 h-20 -z-10" style={{ overflow: 'visible' }}>
              <line
                x1="4"
                y1="4"
                x2="80"
                y2="4"
                stroke="#ff6b35"
                strokeWidth="1"
                opacity="0.2"
              />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Holographic scan lines */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,107,53,0.03) 10px, rgba(255,107,53,0.03) 11px)',
          backgroundSize: '100% 20px',
        }}
      />

      {/* Glowing edges effect */}
      <div className="absolute inset-0 border-2 border-orange-500/10 rounded-3xl z-0" 
           style={{
             boxShadow: 'inset 0 0 100px rgba(255,107,53,0.1), 0 0 100px rgba(255,107,53,0.05)'
           }} />
    </div>
  );
}
