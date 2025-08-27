import { useState, useEffect, useRef } from 'react';
import { 
  getExitIntentState, 
  shouldShowExitIntent, 
  incrementExitIntentShowCount,
  recordMouseLeaveTrigger,
  recordTabSwitchTrigger,
  getExitIntentTimingConstants
} from '../utils/exitIntentState';

interface UseExitIntentOptions {
  onTrigger: (triggerType: 'mouse-leave' | 'tab-switch') => void;
  enabled?: boolean;
  minTimeOnPage?: number;
}

export const useExitIntent = (options: UseExitIntentOptions) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [pageLoadTime] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { MIN_TIME_ON_PAGE_MS } = getExitIntentTimingConstants();
  
  const minTimeOnPage = options.minTimeOnPage || MIN_TIME_ON_PAGE_MS;
  const enabled = options.enabled !== false;

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse leave detection
  useEffect(() => {
    if (!enabled || hasTriggered || isMobile) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the viewport
      // This indicates user is moving toward browser chrome/tabs
      if (e.clientY <= 0 && e.clientX >= 0) {
        const timeOnPage = Date.now() - pageLoadTime;
        
        if (timeOnPage >= minTimeOnPage && shouldShowExitIntent()) {
          console.log('🎯 Exit intent triggered: mouse leave');
          recordMouseLeaveTrigger();
          incrementExitIntentShowCount();
          setHasTriggered(true);
          options.onTrigger('mouse-leave');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, hasTriggered, isMobile, pageLoadTime, minTimeOnPage, options]);

  // Tab switching detection
  useEffect(() => {
    if (!enabled || hasTriggered || isMobile) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Date.now() - pageLoadTime;
        
        if (timeOnPage >= minTimeOnPage && shouldShowExitIntent()) {
          console.log('🎯 Exit intent triggered: tab switch');
          recordTabSwitchTrigger();
          incrementExitIntentShowCount();
          setHasTriggered(true);
          options.onTrigger('tab-switch');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, hasTriggered, isMobile, pageLoadTime, minTimeOnPage, options]);

  // Enhanced mouse movement detection for website navigation header
  useEffect(() => {
    if (!enabled || hasTriggered || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Clear any existing timeout
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }

      // Calculate approximate header height (similar to NavigationToggle logic)
      // Header: ~60px (mobile) to ~68px (desktop)
      // Navigation: ~84px
      // Total fixed height is approximately 140-160px
      const headerHeight = window.innerWidth < 768 ? 144 : 152; // Approximate total header + nav height
      
      // If mouse is within the website navigation header area, start a timer
      if (e.clientY <= headerHeight) {
        mouseLeaveTimeoutRef.current = setTimeout(() => {
          const timeOnPage = Date.now() - pageLoadTime;
          
          if (timeOnPage >= minTimeOnPage && shouldShowExitIntent()) {
            console.log('🎯 Exit intent triggered: mouse in navigation header area');
            recordMouseLeaveTrigger();
            incrementExitIntentShowCount();
            setHasTriggered(true);
            options.onTrigger('mouse-leave');
          }
        }, 1000); // 1 second delay when mouse is in header area
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };
  }, [enabled, hasTriggered, isMobile, pageLoadTime, minTimeOnPage, options]);

  // Reset function for testing
  const reset = () => {
    setHasTriggered(false);
  };

  return {
    hasTriggered,
    isMobile,
    timeOnPage: Date.now() - pageLoadTime,
    reset
  };
};
