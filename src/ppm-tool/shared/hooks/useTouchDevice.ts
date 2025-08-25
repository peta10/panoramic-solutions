import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a touch device
 * Enhanced for better iOS and mobile device detection
 * @returns boolean indicating if the device supports touch
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    // Initialize immediately on client-side to prevent hydration mismatch
    if (typeof window === 'undefined') return false;
    
    // Multiple detection methods for comprehensive touch device detection
    const hasTouchEvents = 'ontouchstart' in window;
    const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
    const hasHoverNone = window.matchMedia && window.matchMedia('(hover: none)').matches;
    const hasPointerCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return hasTouchEvents || hasMaxTouchPoints || hasHoverNone || hasPointerCoarse || isIOS || isMobileUserAgent;
  });
  
  useEffect(() => {
    // Only listen for hover changes, don't re-evaluate everything constantly
    const mediaQuery = window.matchMedia('(hover: none)');
    const handleHoverChange = (e: MediaQueryListEvent) => {
      // Only update if the hover capability actually changed
      setIsTouchDevice(prev => {
        const newValue = e.matches || navigator.maxTouchPoints > 0;
        return prev !== newValue ? newValue : prev;
      });
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleHoverChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleHoverChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleHoverChange);
      } else {
        mediaQuery.removeListener(handleHoverChange);
      }
    };
  }, []);

  return isTouchDevice;
};
