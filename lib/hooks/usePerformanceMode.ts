import { useState, useEffect } from 'react';
import { getPerformanceMode } from '../deviceDetection';

export function usePerformanceMode() {
  const [mode, setMode] = useState<'high' | 'medium' | 'low'>('medium');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMode(getPerformanceMode());
  }, []);

  return {
    mode,
    isClient,
    isLowEnd: mode === 'low',
    isMedium: mode === 'medium',
    isHighEnd: mode === 'high',
    shouldReduceEffects: mode === 'low' || mode === 'medium',
    shouldDisableAnimations: mode === 'low',
  };
}
