// Mobile-specific CSS class optimizations
export const getOptimizedClasses = (baseClasses: string, isMobile: boolean = false): string => {
  if (!isMobile) return baseClasses;
  
  // Replace expensive effects with simpler alternatives on mobile
  return baseClasses
    .replace(/backdrop-blur-\w+/g, '') // Remove backdrop blur
    .replace(/shadow-\w+/g, 'shadow-sm') // Reduce shadows
    .replace(/transition-all/g, 'transition-colors') // Simplify transitions
    .trim();
};

// Conditional rendering helper for heavy components
export const shouldRenderHeavyComponent = (performanceMode: 'high' | 'medium' | 'low'): boolean => {
  return performanceMode === 'high';
};

// Image loading optimization
export const getImageLoadingStrategy = (isMobile: boolean): 'lazy' | 'eager' => {
  return isMobile ? 'lazy' : 'eager';
};

// Animation duration based on device
export const getAnimationDuration = (performanceMode: 'high' | 'medium' | 'low'): number => {
  switch (performanceMode) {
    case 'high':
      return 300;
    case 'medium':
      return 200;
    case 'low':
      return 100;
    default:
      return 200;
  }
};
