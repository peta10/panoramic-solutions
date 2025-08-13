'use client';

import React, { useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/ppm-tool/components/ui/button';

interface HowItWorksOverlayProps {
  isVisible: boolean;
  onClose?: () => void;
  onGetStarted: () => void;
  onManualRanking: () => void;
}

const step1Criteria = [
  "Scalability",
  "Integrations & Extensibility", 
  "Ease of Use",
  "Flexibility & Customization",
  "Reporting & Analytics",
  "Security & Compliance",
  "Portfolio Management"
];

const remainingSteps = [
  {
    number: "02",
    title: "Analyze Tools and Recommendations",
    items: [
      "Explore and evaluate tools that are a best match for you.",
    ]
  },
  {
    number: "03",
    title: "Compare Results",
    items: [
      "Use the interactive chart for further comparisons.",
    ]
  },
  {
    number: "04", 
    title: "Get My Free Comparison Report",
    items: [
      "We'll send a clean, easy-to-read version of your results, rankings, and recommendations to your inbox.",
    ]
  }
];

export const HowItWorksOverlay: React.FC<HowItWorksOverlayProps> = ({
  isVisible,
  onClose,
  onGetStarted,
  onManualRanking
}) => {
  const handleManualRankingClick = () => {
    console.log('Manual Ranking clicked - going directly to tool rankings');
    onManualRanking();
  };

  // Handle body scroll and mobile compatibility
  useEffect(() => {
    if (isVisible && typeof window !== 'undefined') {
      // Store original scroll position and prevent body scroll
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      // Store original styles
      const originalBodyStyle = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        overflow: body.style.overflow,
        width: body.style.width,
        height: body.style.height
      };
      
      // Apply styles to prevent background scroll
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';
      body.style.width = '100%';
      body.style.height = '100%';
      
      return () => {
        // Restore original styles
        Object.keys(originalBodyStyle).forEach(key => {
          body.style[key as any] = originalBodyStyle[key as keyof typeof originalBodyStyle];
        });
        
        // Restore scroll position
        html.scrollTop = scrollY;
        body.scrollTop = scrollY;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        className="absolute inset-4 flex items-center justify-center pointer-events-none"
      >
        <div 
          className="bg-white rounded-xl shadow-xl w-full max-w-sm md:max-w-3xl lg:max-w-4xl max-h-full overflow-y-auto pointer-events-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth'
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => {
            // Ensure wheel events work properly
            e.stopPropagation();
          }}
        >
          <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="relative text-center mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-sm md:text-base text-gray-600">Discover tools that best match your business needs</p>
        </div>
        
        {/* Main layout: Step 1 card with integrated button */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          {/* Step 1: Rank Your Criteria - Main Card with Button */}
          <div className="bg-white rounded-lg md:rounded-t-lg shadow-md border border-gray-200 relative">
            <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-base md:text-2xl font-bold">
              01
            </div>
            <div className="pt-6 md:pt-8 px-4 md:px-6 pb-4 md:pb-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Rank Your Criteria</h3>
              <div className="w-8 md:w-12 h-1 bg-alpine-blue-400 mb-3 md:mb-4"></div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-1 text-sm md:text-base text-gray-700">
                  <p className="text-xs md:text-sm mb-3 md:mb-4">Our guided method ensures your rankings follow the same research-backed framework we use to evaluate tools.</p>
                  <p className="font-medium mb-2 md:mb-3 text-sm md:text-base">Criteria That Is Analyzed:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 md:gap-x-6 md:gap-y-2">
                    {step1Criteria.map((criterion, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full mr-2 md:mr-3 flex-shrink-0"></span>
                        <span className="text-xs md:text-sm">{criterion}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA Button - positioned to the right on desktop, below on mobile */}
                <div className="flex justify-center md:items-center mt-3 md:mt-0">
                  <button
                    onClick={onGetStarted}
                    className="flex flex-col items-center px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-white bg-alpine-blue-400 hover:bg-alpine-blue-500 rounded-lg transition-colors"
                  >
                    <span>Rank Your Criteria</span>
                    <div className="flex items-center mt-0.5">
                      <span className="text-xs">Question 1</span>
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom cards - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
          {remainingSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg md:rounded-t-lg shadow-md border border-gray-200 relative">
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-base md:text-2xl font-bold">
                {step.number}
              </div>
              <div className="pt-6 md:pt-8 px-3 md:px-4 pb-3 md:pb-4">
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 md:mb-3">{step.title}</h3>
                <div className={`w-8 md:w-12 h-1 bg-alpine-blue-400 ${step.number === "03" ? "mb-4 md:mb-6" : "mb-2 md:mb-3"}`}></div>
                <div className="text-xs text-gray-700">
                  {step.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Go Directly to Tool Research button - responsive positioning */}
        <div className="flex justify-center md:justify-start">
          <button
            onClick={handleManualRankingClick}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xs md:text-sm text-gray-600 hover:text-gray-700"
            aria-label="Go Directly to Tool Research"
          >
            <X className="w-4 h-4" />
            Go Directly to Tool Research
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 