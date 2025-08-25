'use client';

import { useState, useEffect } from 'react';

/**
 * Simple, reliable mobile detection hook
 * Uses only window.innerWidth for maximum browser compatibility
 * 
 * @param breakpoint - Width threshold for mobile detection (default: 1023px)
 * @returns boolean indicating if the device is mobile/tablet
 */
export function useMobileDetection(breakpoint: number = 1023): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileState = () => {
      try {
        if (typeof window !== 'undefined') {
          setIsMobile(window.innerWidth <= breakpoint);
        }
      } catch (error) {
        console.warn('Mobile detection failed:', error);
        setIsMobile(false); // Safe fallback
      }
    };

    // Set initial state
    updateMobileState();
    
    // Listen for resize events
    const handleResize = () => updateMobileState();
    
    try {
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.warn('Failed to add resize listener:', error);
    }
    
    return () => {
      try {
        window.removeEventListener('resize', handleResize);
      } catch (error) {
        console.warn('Failed to remove resize listener:', error);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * Legacy hook name for backward compatibility
 * @deprecated Use useMobileDetection instead
 */
export const useIsMobile = useMobileDetection;
