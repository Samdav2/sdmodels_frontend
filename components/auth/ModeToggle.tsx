'use client';

import { motion } from 'framer-motion';
import type { AuthMode } from '@/types/auth';

interface ModeToggleProps {
  mode: AuthMode;
  onToggle: (mode: AuthMode) => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="w-full flex justify-center mb-8">
      <div 
        className="relative inline-flex p-1 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50"
        role="tablist"
        aria-label="Authentication mode"
      >
        {/* Animated Background Slider */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_20px_rgba(255,107,53,0.5)]"
          initial={false}
          animate={{
            left: mode === 'login' ? '4px' : '50%',
            right: mode === 'login' ? '50%' : '4px',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Login Button */}
        <button
          type="button"
          onClick={() => onToggle('login')}
          className={`
            relative z-10 px-8 py-2.5 rounded-full
            font-medium text-sm
            transition-colors duration-200
            ${mode === 'login' 
              ? 'text-white' 
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
          role="tab"
          aria-selected={mode === 'login'}
          aria-controls="auth-form"
          aria-label="Switch to login mode"
        >
          Login
        </button>

        {/* Sign Up Button */}
        <button
          type="button"
          onClick={() => onToggle('signup')}
          className={`
            relative z-10 px-8 py-2.5 rounded-full
            font-medium text-sm
            transition-colors duration-200
            ${mode === 'signup' 
              ? 'text-white' 
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
          role="tab"
          aria-selected={mode === 'signup'}
          aria-controls="auth-form"
          aria-label="Switch to sign up mode"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
