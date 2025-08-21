'use client';

import React, { useState, useEffect } from 'react';
import { useFullscreen } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { Sliders, Layout, LineChart } from 'lucide-react';
import { ActionButtons } from './ActionButtons';
import type { Tool, Criterion } from '@/ppm-tool/shared/types';

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
  onAnimationTrigger?: () => void;
  onShowHowItWorks?: () => void;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  currentStep,
  onStepChange,
  compareCount = 0,
  selectedTools = [],
  selectedCriteria = [],
  onAnimationTrigger,
  onShowHowItWorks
}) => {
  const { isMobile } = useFullscreen();
  const [isChartGlowing, setIsChartGlowing] = useState(false);

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
  }, []);

  // Calculate header height (fixed - no scroll changes)
  const getHeaderHeight = () => {
    // Header uses py-2 (16px padding) consistently
    // Logo height: h-8 (32px) on mobile, h-10 (40px) on desktop
    const padding = 16; // py-2 = 16px (fixed)
    const logoHeight = isMobile ? 32 : 40; // h-8 = 32px, h-10 = 40px
    return padding + logoHeight;
  };

  // Calculate navigation height (fixed - no scroll changes)
  const getNavigationHeight = () => {
    // Navigation uses py-2 (16px padding) consistently
    // Plus content height ~40px
    const padding = 16; // py-2 = 16px (fixed)
    const contentHeight = 40; // Approximate content height
    return padding + contentHeight;
  };

  // Total combined height for content offset
  const getTotalFixedHeight = () => {
    return getHeaderHeight() + getNavigationHeight();
  };

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
      className="fixed w-full bg-white shadow-lg z-50"
      style={{ 
        top: `${getHeaderHeight()}px`, // Position right below the header
        '--total-fixed-height': `${getTotalFixedHeight()}px` // Expose total height for content padding
      } as React.CSSProperties}
      aria-label="PPM Tool Navigation"
      role="navigation"
    >
      <div className="container mx-auto px-3 md:px-4 py-2">
        <div className={cn(
          "flex items-center",
          isMobile ? "justify-center" : "justify-between"
        )}>
          {/* Navigation Steps - Left Side */}
          <div className={cn(
            "flex items-center",
            isMobile ? "w-full max-w-md space-x-1 md:space-x-2 mx-auto" : "space-x-2 md:space-x-4"
          )}>
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isChartStep = step.id === 'chart';
              const shouldGlow = isChartStep && isChartGlowing;
              return (
                <button
                  key={step.id}
                  onClick={() => onStepChange(step.id)}
                  className={cn(
                    'group relative flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-300',
                    isMobile ? 'flex-1 justify-center' : '',
                    isActive
                      ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900',
                    shouldGlow && 'chart-toggle-glow'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-white/20'
                      : 'bg-gray-300 group-hover:bg-gray-400'
                  )}>
                    {React.createElement(step.icon, {
                      className: cn(
                        'w-3 h-3 md:w-4 md:h-4',
                        isActive ? 'text-white' : 'text-gray-500'
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
                      isActive ? 'bg-white text-primary-600' : 'bg-alpine-blue-500 text-white'
                    )}>
                      {compareCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* PPM Tool Title - Center (Desktop only) */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-md">
              <h1 className="text-sm md:text-base font-black text-gray-900">
                PPM Tool Finder
              </h1>
              <p className="text-xs text-gray-600 leading-tight">
                Get 100% free personalized recommendations with our intelligent Project Portfolio Management Tool assessment.
              </p>
            </div>
          )}
          
          {/* Action Buttons - Right Side (Desktop only) */}
          {!isMobile && (
            <ActionButtons 
              selectedTools={selectedTools} 
              selectedCriteria={selectedCriteria}
              onShowHowItWorks={onShowHowItWorks}
            />
          )}
        </div>

        {/* Mobile Title - Below navigation */}
        {isMobile && (
          <div className="text-center mt-2 pt-2 border-t border-gray-200/50">
            <h1 className="text-xs font-black text-gray-900">
              PPM Tool Finder
            </h1>
            <p className="text-xs text-gray-600 leading-tight">
              Get 100% free personalized recommendations with our intelligent Project Portfolio Management Tool assessment.
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}; 