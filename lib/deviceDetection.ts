// Device detection and performance utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for low-end indicators
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  
  // Check device memory (if available)
  const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  
  // Check hardware concurrency (CPU cores)
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  return slowConnection || lowMemory || lowCPU;
};

export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getPerformanceMode = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';
  
  if (isLowEndDevice() || shouldReduceMotion()) {
    return 'low';
  }
  
  if (isMobile()) {
    return 'medium';
  }
  
  return 'high';
};
