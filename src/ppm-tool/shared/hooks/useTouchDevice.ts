import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a touch device
 * @returns boolean indicating if the device supports touch
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Check for touch capability using multiple methods for better detection
    const hasTouch = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (window.matchMedia && window.matchMedia('(hover: none)').matches);
    
    setIsTouchDevice(hasTouch);
  }, []);

  return isTouchDevice;
};
