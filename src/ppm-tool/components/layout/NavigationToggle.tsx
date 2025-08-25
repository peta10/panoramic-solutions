'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMobileDetection } from '@/ppm-tool/shared/hooks/useMobileDetection';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { Sliders, Layout, LineChart } from 'lucide-react';
import { ActionButtons } from './ActionButtons';
import type { Tool, Criterion } from '@/ppm-tool/shared/types';
import Image from 'next/image';

type NavigationStep = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
};

interface NavigationToggleProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  compareCount?: number;
  selectedTools?: Tool[];
  selectedCriteria?: Criterion[];
  filteredTools?: Tool[];
  onAnimationTrigger?: () => void;
  onShowHowItWorks?: () => void;
  isProductBumperVisible?: boolean;
  onChartButtonPosition?: (position: { x: number; y: number }) => void;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  currentStep,
  onStepChange,
  compareCount = 0,
  selectedTools = [],
  selectedCriteria = [],
  filteredTools = [],
  onAnimationTrigger,
  onShowHowItWorks,
  isProductBumperVisible = false,
  onChartButtonPosition
}) => {
  const isMobile = useMobileDetection();
  const [isChartGlowing, setIsChartGlowing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const chartButtonRef = useRef<HTMLButtonElement>(null);

  // Update chart button position when component mounts or layout changes
  const updateChartButtonPosition = useCallback(() => {
    if (chartButtonRef.current && onChartButtonPosition) {
      const rect = chartButtonRef.current.getBoundingClientRect();
      onChartButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, [onChartButtonPosition]);

  // Calculate header height (fixed - no scroll changes)
  const getHeaderHeight = useCallback(() => {
    // Header uses py-2 (16px padding) consistently
    // Logo height: h-8 (32px) on mobile, h-10 (40px) on desktop
    const padding = 16; // py-2 = 16px (fixed)
    const logoHeight = isMobile ? 32 : 40; // h-8 = 32px, h-10 = 40px
    
    // Add safe area inset for mobile devices
    if (isMobile && typeof window !== 'undefined') {
      // SAFE: Use default safe area instead of getComputedStyle which can fail in Edge/Safari
      const safeAreaTop = 0; // Safe default - CSS custom properties can cause crashes
      // Add extra padding for mobile to ensure content isn't cut off
      const mobileExtraPadding = 24; // Increased from 16 to 24px for more space
      return padding + logoHeight + safeAreaTop + mobileExtraPadding;
    }
    
    return padding + logoHeight;
  }, [isMobile]);

  // Calculate navigation height (fixed - no scroll changes)
  const getNavigationHeight = useCallback(() => {
    // Navigation uses py-2 (16px padding) consistently
    // Plus content height ~40px
    const padding = 16; // py-2 = 16px (fixed)
    const contentHeight = 40; // Approximate content height
    
    // Add extra height for mobile logo section
    const mobileLogoHeight = isMobile ? 60 : 0; // Logo + border + padding
    
    // Add extra spacing between navigation and main content
    const extraSpacing = isMobile ? 32 : 48; // Increased spacing: mobile from 24 to 32px, desktop from 32 to 48px
    
    return padding + contentHeight + mobileLogoHeight + extraSpacing;
  }, [isMobile]);

  // Total combined height for content offset
  const getTotalFixedHeight = useCallback(() => {
    return getHeaderHeight() + getNavigationHeight();
  }, [getHeaderHeight, getNavigationHeight]);

  // Update position on mount and when compare count changes (affects button size)
  useEffect(() => {
    updateChartButtonPosition();
  }, [updateChartButtonPosition, compareCount]);

  // Listen for animation triggers
  useEffect(() => {
    const handleAnimationTrigger = () => {
      // Only trigger if not already glowing to prevent double animations
      if (!isChartGlowing) {
        setIsChartGlowing(true);
        // Remove glow after 1.2 seconds to match CSS animation duration
        setTimeout(() => {
          setIsChartGlowing(false);
        }, 1200);
      }
    };

    // Listen for custom events from the animation
    if (typeof window !== 'undefined') {
      window.addEventListener('chartToggleGlow', handleAnimationTrigger);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('chartToggleGlow', handleAnimationTrigger);
      }
    };
  }, [isChartGlowing]);

  // Set chart button position for animation
  useEffect(() => {
    if (chartButtonRef.current) {
      const rect = chartButtonRef.current.getBoundingClientRect();
      onChartButtonPosition?.({ x: rect.left, y: rect.top });
    }
  }, [onChartButtonPosition]);

  // Update CSS custom property when height changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const totalHeight = getTotalFixedHeight();
      document.documentElement.style.setProperty('--total-fixed-height', `${totalHeight}px`);
    }
  }, [isMobile, getTotalFixedHeight]); // Recalculate when mobile state changes

  // Handle resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const totalHeight = getTotalFixedHeight();
        document.documentElement.style.setProperty('--total-fixed-height', `${totalHeight}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile, getTotalFixedHeight]);

  // Handle scroll to show/hide shadow
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Show shadow when scrolled more than 10px to avoid flickering
      setIsScrolled(scrollTop > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const steps: NavigationStep[] = isMobile 
    ? [
        { id: 'criteria', label: 'Rank Your Criteria', icon: Sliders, description: 'Set importance levels' },
        { id: 'tools', label: 'Tools & Recommendations', icon: Layout, description: 'Choose PPM solutions' },
        { id: 'chart', label: 'Tools - Criteria Comparison', icon: LineChart, description: 'Visual comparison' },
      ]
    : [
        { id: 'criteria-tools', label: 'Criteria + Tools', icon: Layout, description: 'Set criteria & select tools' },
        { id: 'chart', label: 'Chart Comparison', icon: LineChart, description: 'Compare solutions' },
      ];

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isProductBumperVisible && "blur-sm opacity-75",
        isScrolled && "shadow-md shadow-gray-300/70"
      )}
      style={{ 
        backgroundColor: '#F0F4FE',
        top: `${getHeaderHeight()}px`, // Position right below the header
        '--total-fixed-height': `${getTotalFixedHeight()}px` // Expose total height for content padding
      } as React.CSSProperties}
      aria-label="PPM Tool Navigation"
      role="navigation"
    >
      <div className="container mx-auto px-3 md:px-4 pt-4 pb-2">
        <div className={cn(
          "flex items-center",
          isMobile ? "justify-center" : "justify-between"
        )}>
          {/* Navigation Steps - Left Side */}
          <div className={cn(
            "flex items-center",
            isMobile ? "w-full max-w-md space-x-1 md:space-x-2 mx-auto" : "space-x-2 md:space-x-4"
          )}>
            {/* Toggle Container */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isChartStep = step.id === 'chart';
                const shouldGlow = isChartStep && isChartGlowing;
                return (
                  <button
                    key={step.id}
                    ref={isChartStep ? chartButtonRef : undefined}
                    onClick={() => onStepChange(step.id)}
                    className={cn(
                      'relative flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-md transition-all duration-300 font-medium border',
                      isMobile ? 'flex-1 justify-center' : '',
                      isActive
                        ? 'bg-alpine-blue-50 text-alpine-blue-700 border-alpine-blue-200 shadow-sm'
                        : 'text-gray-700 hover:text-alpine-blue-500 hover:bg-alpine-blue-50 border-transparent hover:border-alpine-blue-200',
                      shouldGlow && 'chart-toggle-glow'
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg transition-all duration-300',
                      isActive
                        ? 'bg-alpine-blue-100 text-alpine-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    )}>
                      {React.createElement(step.icon, {
                        className: cn(
                          'w-3 h-3 md:w-4 md:h-4',
                          isActive ? 'text-alpine-blue-600' : 'text-gray-500'
                        )
                      })}
                    </div>
                    <span className={cn(
                      'font-medium',
                      isMobile ? 'text-xs md:text-sm' : 'text-sm md:text-base'
                    )}>
                      {step.label}
                    </span>
                    {isChartStep && compareCount > 0 && (
                      <div className={cn(
                        'absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full text-xs font-medium',
                        isActive ? 'bg-alpine-blue-500 text-white' : 'bg-gray-600 text-white'
                      )}>
                        {compareCount}
                      </div>
                    )}
                    {/* Enhanced underline indicator */}
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all duration-300",
                      isActive ? "bg-alpine-blue-500" : "bg-transparent"
                    )} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* PPM Tool Logo - Center (Desktop only) */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-lg lg:max-w-xl">
              <div className="flex justify-center">
                <Image
                  src="/images/PPM_Tool_Finder.png"
                  alt="PPM Tool Finder"
                  width={250}
                  height={75}
                  className="h-10 md:h-14 lg:h-18 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          )}
          
          {/* Action Buttons - Right Side (Desktop only) */}
          {!isMobile && (
            <ActionButtons 
              selectedTools={selectedTools} 
              selectedCriteria={selectedCriteria}
              filteredTools={filteredTools}
              onShowHowItWorks={onShowHowItWorks}
            />
          )}
        </div>

        {/* Mobile Logo - Below navigation */}
        {isMobile && (
          <div className="text-center mt-3 pt-3 border-t border-gray-200/50">
            <div className="flex justify-center px-4">
              <Image
                src="/images/PPM_Tool_Finder.png"
                alt="PPM Tool Finder"
                width={200}
                height={60}
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}; 