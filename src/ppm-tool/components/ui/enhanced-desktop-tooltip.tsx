import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTouchDevice } from '@/ppm-tool/shared/hooks/useTouchDevice';

interface EnhancedDesktopTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  delay?: number;
}

/**
 * Enhanced desktop tooltip with better cross-browser compatibility
 * Designed to work consistently across different browsers and geographic locations
 */
export const EnhancedDesktopTooltip: React.FC<EnhancedDesktopTooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  className = '',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const isTouchDevice = useTouchDevice();

  // Enhanced hover detection with multiple fallback mechanisms
  const [supportsHover, setSupportsHover] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    try {
      // Multi-layered hover capability detection
      const userAgent = navigator.userAgent || '';
      const platform = navigator.platform || '';
      
      // Enhanced desktop detection with geographic considerations
      const isDesktopUA = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(userAgent);
      const isDesktopPlatform = /Win|Mac|Linux|X11/i.test(platform);
      
      // Screen size check as additional validation
      const hasDesktopScreen = window.screen ? 
        (window.screen.width >= 1024 && window.screen.height >= 768) : 
        (window.innerWidth >= 1024);
      
      // Check for hover capability using multiple methods with enhanced error handling
      let hasHoverCapability = true;
      
      if (window.matchMedia) {
        try {
          // Create a test function to safely check media queries
          const safeMatchMedia = (query: string) => {
            try {
              return window.matchMedia(query).matches;
            } catch {
              return false;
            }
          };
          
          // Primary detection with error handling
          const hoverHover = safeMatchMedia('(hover: hover)');
          const pointerFine = safeMatchMedia('(pointer: fine)');
          const hoverNone = safeMatchMedia('(hover: none)');
          
          // Secondary detection for browsers with partial support
          const anyHover = safeMatchMedia('(any-hover: hover)');
          const anyPointerFine = safeMatchMedia('(any-pointer: fine)');
          
          // Tertiary detection for older browsers
          const minDeviceWidth = safeMatchMedia('(min-device-width: 1024px)');
          const notTouchDevice = safeMatchMedia('not (pointer: coarse)');
          
          // Combine multiple indicators with preference for conservative desktop detection
          const hasModernHover = hoverHover || pointerFine;
          const hasLegacyHover = anyHover || anyPointerFine || (minDeviceWidth && notTouchDevice);
          const hasBasicDesktopIndicators = !hoverNone && isDesktopUA && isDesktopPlatform;
          
          hasHoverCapability = hasModernHover || hasLegacyHover || (hasBasicDesktopIndicators && hasDesktopScreen);
          
          // Additional validation: if no media queries work but it looks like desktop, assume hover
          if (!hasModernHover && !hasLegacyHover && !hoverNone && isDesktopUA && hasDesktopScreen) {
            hasHoverCapability = true;
          }
        } catch (e) {
          // Comprehensive fallback if media queries fail completely
          console.warn('Media query system failed, using fallback detection:', e);
          hasHoverCapability = isDesktopUA && isDesktopPlatform && hasDesktopScreen;
        }
      } else {
        // Very old browser - use comprehensive UA and platform detection
        hasHoverCapability = isDesktopUA && isDesktopPlatform && hasDesktopScreen;
      }
      
      return hasHoverCapability;
    } catch (e) {
      // Ultimate fallback - assume hover support to avoid breaking functionality
      console.warn('Hover detection completely failed, defaulting to hover support:', e);
      return true;
    }
  });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    // Calculate base position
    switch (side) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        switch (align) {
          case 'start':
            left = triggerRect.left + scrollX;
            break;
          case 'center':
            left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'end':
            left = triggerRect.right + scrollX - tooltipRect.width;
            break;
        }
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8;
        switch (align) {
          case 'start':
            left = triggerRect.left + scrollX;
            break;
          case 'center':
            left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'end':
            left = triggerRect.right + scrollX - tooltipRect.width;
            break;
        }
        break;
      case 'left':
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        switch (align) {
          case 'start':
            top = triggerRect.top + scrollY;
            break;
          case 'center':
            top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
            break;
          case 'end':
            top = triggerRect.bottom + scrollY - tooltipRect.height;
            break;
        }
        break;
      case 'right':
        left = triggerRect.right + scrollX + 8;
        switch (align) {
          case 'start':
            top = triggerRect.top + scrollY;
            break;
          case 'center':
            top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
            break;
          case 'end':
            top = triggerRect.bottom + scrollY - tooltipRect.height;
            break;
        }
        break;
    }

    // Viewport boundary checks with padding
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
    }
    if (top < scrollY + padding) top = scrollY + padding;
    if (top + tooltipRect.height > scrollY + viewportHeight - padding) {
      top = scrollY + viewportHeight - tooltipRect.height - padding;
    }

    setPosition({ top, left });
  }, [side, align]);

  // Show tooltip with delay
  const showTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  // Hide tooltip with small delay to prevent flickering
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  // Enhanced event detection to handle browser differences and geographic variations
  const isRealHoverEvent = useCallback((e: React.MouseEvent) => {
    // Multiple checks to ensure this is a genuine hover event
    const nativeEvent = e.nativeEvent;
    
    // Check for touch events
    if (nativeEvent && 'touches' in nativeEvent) return false;
    
    // Check for synthesized events (common in some browsers/regions)
    if (nativeEvent && 'isTrusted' in nativeEvent && !nativeEvent.isTrusted) return false;
    
    // Check pointer type if available (modern browsers)
    if ('pointerType' in nativeEvent && nativeEvent.pointerType === 'touch') return false;
    
    // Additional checks for mouse-like behavior
    if ('buttons' in nativeEvent && typeof nativeEvent.buttons === 'number') {
      // If buttons are pressed, it's likely a drag operation, not a hover
      return nativeEvent.buttons === 0;
    }
    
    return true;
  }, []);

  // Handle mouse events with enhanced compatibility
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!isRealHoverEvent(e)) return;
    showTooltip();
  }, [showTooltip, isRealHoverEvent]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!isRealHoverEvent(e)) return;
    hideTooltip();
  }, [hideTooltip, isRealHoverEvent]);

  // Handle focus events for keyboard accessibility
  const handleFocus = useCallback(() => {
    showTooltip();
  }, [showTooltip]);

  const handleBlur = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is ready
      const positionTimer = setTimeout(calculatePosition, 10);
      return () => clearTimeout(positionTimer);
    }
  }, [isVisible, calculatePosition]);

  // Handle window resize and scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isVisible, calculatePosition]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // On touch devices or devices without hover capability, just render children
  if (isTouchDevice || !supportsHover) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-md shadow-xl pointer-events-none max-w-xs break-words ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            // Enhanced cross-browser rendering optimizations
            transform: 'translateZ(0)',
            willChange: 'transform',
            // Prevent text selection issues across browsers
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            // Enhanced visibility and performance
            opacity: 1,
            visibility: 'visible',
            // Prevent content shifting
            boxSizing: 'border-box',
            // Better font rendering across systems/regions
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSmooth: 'always',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            // Ensure consistent line height
            lineHeight: '1.4',
            // Better text wrapping
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            // Prevent layout shifts in different browsers
            contain: 'layout style',
            // Performance optimization for animations
            backfaceVisibility: 'hidden'
          }}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          }}
          onMouseLeave={hideTooltip}
        >
          {content}
        </div>
      )}
    </>
  );
};
