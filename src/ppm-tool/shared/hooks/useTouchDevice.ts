import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a touch device
 * Enhanced for better iOS and mobile device detection
 * @returns boolean indicating if the device supports touch
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Multiple detection methods for comprehensive touch device detection
    const checkTouchDevice = () => {
      // Method 1: Basic touch events
      const hasTouchEvents = 'ontouchstart' in window;
      
      // Method 2: Navigator touch points
      const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
      
      // Method 3: CSS media query for hover capability
      const hasHoverNone = window.matchMedia && window.matchMedia('(hover: none)').matches;
      
      // Method 4: Check for pointer capabilities
      const hasPointerCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      
      // Method 5: iOS/Safari specific detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      // Method 6: Mobile user agent detection as fallback
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Device is considered touch if any of these conditions are true
      return hasTouchEvents || hasMaxTouchPoints || hasHoverNone || hasPointerCoarse || isIOS || isMobileUserAgent;
    };
    
    setIsTouchDevice(checkTouchDevice());
    
    // Also listen for changes in hover capabilities (e.g., when external mouse is connected/disconnected)
    const mediaQuery = window.matchMedia('(hover: none)');
    const handleHoverChange = () => setIsTouchDevice(checkTouchDevice());
    
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
