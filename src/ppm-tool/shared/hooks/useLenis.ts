'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useLenis = (options: {
  disabled?: boolean;
  lerp?: number;
  duration?: number;
  isMobile?: boolean;
} = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const {
      disabled = false,
      lerp = 0.1,
      duration = 1.2,
      isMobile = false
    } = options;

    // Don't initialize Lenis if disabled
    if (disabled) return;

    // Initialize Lenis with mobile-optimized settings
    lenisRef.current = new Lenis({
      lerp: isMobile ? 0.15 : lerp,
      duration: isMobile ? 1 : duration,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Disable sync touch to prevent interference
      touchMultiplier: isMobile ? 2 : 1,
      // touchInertiaMultiplier: isMobile ? 45 : 35, // This property doesn't exist in LenisOptions
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      wheelMultiplier: 1,
      infinite: false
    });

    // Add event listener to stop Lenis when hovering over elements with data-lenis-prevent
    if (typeof document !== 'undefined') {
      document.addEventListener('mouseenter', (e) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && target.closest('[data-lenis-prevent]')) {
        lenisRef.current?.stop();
      }
    }, true);

      document.addEventListener('mouseleave', (e) => {
        const target = e.target as HTMLElement;
        if (target && typeof target.closest === 'function' && target.closest('[data-lenis-prevent]')) {
          lenisRef.current?.start();
        }
      }, true);

      // Stop Lenis when scrolling elements with data-lenis-prevent
      document.addEventListener('wheel', (e) => {
        const target = e.target as HTMLElement;
        if (target && typeof target.closest === 'function' && target.closest('[data-lenis-prevent]')) {
          // Stop Lenis to allow native scrolling
          lenisRef.current?.stop();
          
          // Re-enable Lenis after a short delay to ensure smooth transition
          setTimeout(() => {
            lenisRef.current?.start();
          }, 100);
        }
      }, { passive: true });
    }

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [options.disabled, options.lerp, options.duration, options.isMobile]);

  // Provide methods to control Lenis
  const scrollTo = (target: string | number | HTMLElement, options?: { 
    offset?: number;
    lerp?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    force?: boolean;
  }) => {
    lenisRef.current?.scrollTo(target, options);
  };

  const start = () => {
    lenisRef.current?.start();
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const resize = () => {
    lenisRef.current?.resize();
  };

  return {
    lenis: lenisRef.current,
    scrollTo,
    start,
    stop,
    resize
  };
}; 