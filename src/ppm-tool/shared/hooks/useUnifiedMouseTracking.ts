/**
 * Unified Mouse Tracking Hook
 * Integrates with the unified bumper state management system
 * Tracks mouse movement and stillness for timing-based bumper triggers
 */

import { useEffect, useRef, useCallback } from 'react';
import { 
  recordMouseMovement, 
  recordMouseStopped, 
  recordInitialTimerComplete,
  recordMouseMovementTimerComplete,
  getUnifiedBumperTimingConstants 
} from '../utils/unifiedBumperState';

interface UseUnifiedMouseTrackingOptions {
  enabled?: boolean;
  onInitialTimerComplete?: () => void;
  onMouseMovementTimerComplete?: () => void;
}

export function useUnifiedMouseTracking(options: UseUnifiedMouseTrackingOptions = {}) {
  const { enabled = true, onInitialTimerComplete, onMouseMovementTimerComplete } = options;
  
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMovementTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePositionRef = useRef({ x: 0, y: 0, time: 0 });
  const initialTimerStartedRef = useRef(false);
  
  const { INITIAL_TIMER_MS, MOUSE_MOVEMENT_TIMER_MS } = getUnifiedBumperTimingConstants();
  
  // Start the initial 23-second timer on mount
  useEffect(() => {
    if (!enabled || initialTimerStartedRef.current) return;
    
    initialTimerStartedRef.current = true;
    
    console.log('⏱️ Starting initial 23s timer for bumper system');
    initialTimerRef.current = setTimeout(() => {
      recordInitialTimerComplete();
      onInitialTimerComplete?.();
      console.log('✅ Initial 23s timer completed');
    }, INITIAL_TIMER_MS);
    
    return () => {
      if (initialTimerRef.current) {
        clearTimeout(initialTimerRef.current);
        initialTimerRef.current = null;
      }
    };
  }, [enabled, INITIAL_TIMER_MS, onInitialTimerComplete]);
  
  // Mouse movement detection and stillness tracking
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Clear existing mouse movement timer
      if (mouseMovementTimerRef.current) {
        clearTimeout(mouseMovementTimerRef.current);
        mouseMovementTimerRef.current = null;
      }
      
      // Record mouse movement
      recordMouseMovement();
      
      // Update position tracking
      const currentTime = Date.now();
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY, time: currentTime };
      
      // Start a new timer for mouse stillness detection
      mouseMovementTimerRef.current = setTimeout(() => {
        recordMouseStopped();
        
        // Start the 3-second timer for mouse movement completion
        setTimeout(() => {
          recordMouseMovementTimerComplete();
          onMouseMovementTimerComplete?.();
          console.log('✅ Mouse movement 3s timer completed');
        }, MOUSE_MOVEMENT_TIMER_MS);
        
      }, 100); // Small delay to detect when mouse actually stops
    };
    
    // Add event listener
    try {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
    } catch (e) {
      // Fallback for older browsers
      document.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseMovementTimerRef.current) {
        clearTimeout(mouseMovementTimerRef.current);
        mouseMovementTimerRef.current = null;
      }
    };
  }, [enabled, MOUSE_MOVEMENT_TIMER_MS, onMouseMovementTimerComplete]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (initialTimerRef.current) {
        clearTimeout(initialTimerRef.current);
      }
      if (mouseMovementTimerRef.current) {
        clearTimeout(mouseMovementTimerRef.current);
      }
    };
  }, []);
  
  return {
    lastMousePosition: lastMousePositionRef.current
  };
}
