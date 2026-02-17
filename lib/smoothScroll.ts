/**
 * Smooth Scroll Utilities
 * Enhanced scrolling for better UX on all devices
 */

/**
 * Smooth scroll to element by ID
 */
export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Smooth scroll to top
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Smooth scroll to bottom
 */
export const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};

/**
 * Enable momentum scrolling on iOS
 */
export const enableMomentumScrolling = () => {
  if (typeof window !== 'undefined') {
    (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
    (document.body.style as any).webkitOverflowScrolling = 'touch';
  }
};

/**
 * Smooth scroll with easing for better mobile experience
 */
export const smoothScrollTo = (targetY: number, duration: number = 800) => {
  const startY = window.pageYOffset;
  const difference = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const scroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * ease);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

/**
 * Initialize smooth scrolling enhancements
 */
export const initSmoothScrolling = () => {
  if (typeof window === 'undefined') return;

  // Enable momentum scrolling
  enableMomentumScrolling();

  // Add smooth scroll class to html
  document.documentElement.classList.add('smooth-scroll');

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const targetId = href.substring(1);
        scrollToElement(targetId, 80); // 80px offset for fixed headers
      }
    });
  });
};
