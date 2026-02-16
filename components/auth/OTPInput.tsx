'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { motion } from 'framer-motion';

interface OTPInputProps {
  length: number;
  onComplete: (code: string) => void;
  onResend: () => void;
}

export default function OTPInput({ length, onComplete, onResend }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Check if all cells are filled and call onComplete
  useEffect(() => {
    const code = values.join('');
    if (code.length === length && values.every(v => v !== '')) {
      onComplete(code);
    }
  }, [values, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Auto-focus next cell if value entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (values[index]) {
        // Clear current cell
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
      } else if (index > 0) {
        // Move to previous cell and clear it
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.slice(0, length).split('');
    const newValues = [...values];
    
    digits.forEach((digit, i) => {
      if (i < length) {
        newValues[i] = digit;
      }
    });
    
    setValues(newValues);
    
    // Focus the next empty cell or the last cell
    const nextEmptyIndex = newValues.findIndex(v => v === '');
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
    setFocusedIndex(focusIndex);
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <div className="w-full space-y-6">
      {/* OTP Input Cells */}
      <div className="flex justify-center gap-3">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {/* Hexagonal Container */}
            <div className="relative w-14 h-16">
              {/* Hexagon SVG Background */}
              <svg
                viewBox="0 0 100 115"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
              >
                <motion.path
                  d="M50 0 L93.3 28.75 L93.3 86.25 L50 115 L6.7 86.25 L6.7 28.75 Z"
                  fill="rgba(15, 23, 42, 0.5)"
                  stroke={focusedIndex === index ? '#06b6d4' : '#475569'}
                  strokeWidth="3"
                  className="backdrop-blur-md"
                  animate={{
                    stroke: focusedIndex === index ? '#06b6d4' : '#475569',
                  }}
                  transition={{ duration: 0.2 }}
                />
                {focusedIndex === index && (
                  <motion.path
                    d="M50 0 L93.3 28.75 L93.3 86.25 L50 115 L6.7 86.25 L6.7 28.75 Z"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))',
                    }}
                  />
                )}
              </svg>

              {/* Input Field */}
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => handleFocus(index)}
                className="
                  absolute inset-0
                  w-full h-full
                  bg-transparent
                  text-white text-2xl font-bold
                  text-center
                  outline-none
                  caret-cyan-400
                "
                aria-label={`Digit ${index + 1} of ${length}`}
              />

              {/* Glow Effect when filled */}
              {value && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <svg
                    viewBox="0 0 100 115"
                    className="absolute inset-0 w-full h-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M50 0 L93.3 28.75 L93.3 86.25 L50 115 L6.7 86.25 L6.7 28.75 Z"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
                      }}
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resend Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onResend}
          className="
            text-sm text-cyan-400
            hover:text-cyan-300
            transition-colors duration-200
            underline underline-offset-2
          "
          aria-label="Resend verification code"
        >
          Didn't receive a code? Resend
        </button>
      </div>
    </div>
  );
}
