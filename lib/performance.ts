/**
 * Performance Optimization Utilities for SDModels
 * Created by Dawodu David Imole (SD)
 */

// Lazy load images with intersection observer
export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        if (target.dataset.src) {
          target.src = target.dataset.src;
          target.removeAttribute('data-src');
          observer.unobserve(target);
        }
      }
    });
  });

  observer.observe(img);
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Preload critical resources
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Prefetch next page
export const prefetchPage = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimize animation frame
export const requestIdleCallback = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

// Web Vitals tracking
export const reportWebVitals = (metric: any) => {
  // Send to analytics
  if (process.env.NODE_ENV === 'production') {
    console.log(metric);
    // You can send to Google Analytics, Vercel Analytics, etc.
  }
};

// Image optimization helper
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  quality: number = 75
): string => {
  // For Next.js Image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
};

// Cache API responses
export const cacheResponse = async (
  key: string,
  fetcher: () => Promise<any>,
  ttl: number = 300000 // 5 minutes default
) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }

  const data = await fetcher();
  localStorage.setItem(
    key,
    JSON.stringify({ data, timestamp: Date.now() })
  );
  return data;
};

// Measure performance
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
};

// Optimize bundle size by code splitting
export const dynamicImport = async (path: string) => {
  return await import(/* webpackChunkName: "[request]" */ `${path}`);
};
