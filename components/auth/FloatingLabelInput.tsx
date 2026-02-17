'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingLabelInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function FloatingLabelInput({
  label,
  type,
  value,
  onChange,
  error,
  required = false,
  onFocus,
  onBlur,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  
  const isFloating = isFocused || value.length > 0;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full">
      {/* Input Container with Glassmorphism */}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className={`
            w-full px-4 pt-6 pb-2 
            bg-slate-900/30 backdrop-blur-md
            border-2 rounded-lg
            text-white text-base
            transition-all duration-300 ease-out
            focus:outline-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
              : isFocused 
                ? 'border-orange-500 shadow-[0_0_20px_rgba(255,107,53,0.5)]'
                : 'border-slate-600/50 hover:border-slate-500/70'
            }
          `}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        
        {/* Floating Label with Neon Glow */}
        <motion.label
          htmlFor={inputId}
          animate={{
            y: isFloating ? -24 : 8,
            scale: isFloating ? 0.85 : 1,
            x: isFloating ? -4 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          className={`
            absolute left-4 top-2
            pointer-events-none
            origin-left
            transition-colors duration-300
            font-medium
            px-1
            ${isFloating ? 'bg-slate-900/80 backdrop-blur-sm' : ''}
            ${error
              ? 'text-red-400'
              : isFocused
                ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]'
                : 'text-slate-400'
            }
          `}
        >
          {label}
          {required && <span className="text-orange-400 ml-1">*</span>}
        </motion.label>
      </div>

      {/* Error Message with Animation */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            role="alert"
            aria-live="polite"
          >
            <p className="text-red-400 text-sm mt-2 ml-1 flex items-center gap-1.5">
              <svg 
                className="w-4 h-4 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
