'use client';

import React, { useState, useRef } from 'react';
import { Criterion } from '@/ppm-tool/shared/types';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';
import { DraggableList } from '@/ppm-tool/components/interactive/DraggableList';
import { defaultCriteria } from '@/ppm-tool/data/criteria';


import { CriteriaGuidance } from '@/ppm-tool/components/overlays/CriteriaGuidance';
import { Slider } from '@/ppm-tool/components/ui/slider';
import { MobileTooltip } from '@/ppm-tool/components/ui/MobileTooltip';
import { EnhancedDesktopTooltip } from '@/ppm-tool/components/ui/enhanced-desktop-tooltip';
import { useTouchDevice } from '@/ppm-tool/shared/hooks/useTouchDevice';

import { useGuidance } from '@/ppm-tool/shared/contexts/GuidanceContext';

interface CriteriaSectionProps {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
  startWithGuidedQuestions?: boolean;
  guidedButtonRef?: React.RefObject<HTMLButtonElement>;
  onOpenGuidedRanking?: () => void;
}

export const CriteriaSection: React.FC<CriteriaSectionProps> = ({
  criteria,
  onCriteriaChange,
  startWithGuidedQuestions = false,
  guidedButtonRef,
  onOpenGuidedRanking
}) => {

  // Helper function to get tooltip description
  const getTooltipDescription = (criterion: Criterion) => {
    if (criterion.tooltipDescription) {
      return criterion.tooltipDescription;
    }
    // Fallback to default criteria
    const defaultCriterion = defaultCriteria.find(dc => dc.name === criterion.name);
    return defaultCriterion?.tooltipDescription || `Detailed information about ${criterion.name} rating guidelines.`;
  };


  const sectionRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useTouchDevice();
  const { 
    showManualGuidance, 
    closeManualGuidance,
    showProductBumper
  } = useGuidance();

  // Debug logging
  // Debug logs removed to prevent performance issues
  // console.log('CriteriaSection - showProductBumper:', showProductBumper);
  // console.log('CriteriaSection - guidedButtonRef:', guidedButtonRef);

  const handleGuidedRankingsClick = () => {
    onOpenGuidedRanking?.();
  };

  const handleUseGuided = () => {
    closeManualGuidance();
    onOpenGuidedRanking?.();
  };

  const handleGuidanceClose = () => {
    closeManualGuidance();
  };

  // Create a stable reference for onCriteriaChange to avoid infinite loops  
  const onCriteriaChangeRef = React.useRef(onCriteriaChange);
  onCriteriaChangeRef.current = onCriteriaChange;
  
  // Create individual callbacks for each criterion to prevent recreation
  const criteriaIds = React.useMemo(() => criteria.map(c => c.id).join(','), [criteria]);
  const sliderCallbacks = React.useMemo(() => {
    const callbacks: Record<string, (value: number[]) => void> = {};
    criteria.forEach((criterion) => {
      callbacks[criterion.id] = (value: number[]) => {
        const updatedCriteria = criteria.map((c) =>
          c.id === criterion.id
            ? { ...c, userRating: value[0] }
            : c
        );
        onCriteriaChangeRef.current(updatedCriteria);
      };
    });
    return callbacks;
  }, [criteria]); // Recreate when criteria change

  return (
    <>
      {/* Guidance Popup - Moved OUTSIDE the overflow-hidden container */}
      <CriteriaGuidance
        isVisible={showManualGuidance}
        onClose={handleGuidanceClose}
        onUseGuided={handleUseGuided}
      />
      
      <div 
        ref={sectionRef}
        id="criteria-section" 
        className={`bg-white rounded-lg shadow-lg flex flex-col h-full relative border border-gray-200`}
        style={{ overflow: 'visible' }}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 pb-3 md:pb-4 border-b bg-white rounded-t-lg">
            <div className="flex items-center">
              <Sliders className="w-5 h-5 md:w-6 md:h-6 mr-2 text-alpine-blue-400" />
              <div className="flex items-center">
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Rank Your Criteria</h2>
                <span className="hidden md:block ml-2 text-xs md:text-sm text-gray-500">
                  {criteria.length} {criteria.length === 1 ? 'criterion' : 'criteria'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                ref={guidedButtonRef}
                onClick={handleGuidedRankingsClick}
                
                className={`flex items-center gap-1 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-alpine-blue-400 hover:bg-alpine-blue-500 rounded-lg transition-all duration-300 ${
                  showProductBumper 
                    ? 'ring-4 ring-alpine-blue-400 ring-opacity-50 shadow-lg scale-105 relative z-50' 
                    : 'relative z-10'
                }`}
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Guided Rankings</span>
                <span className="sm:hidden">Guided Rankings</span>
              </button>

            </div>
          </div>

          {/* Sub-header */}
          <div className="flex-shrink-0 border-b bg-gray-50">
            <div className="px-6 py-3 h-[76px] flex items-center">
              <p className="text-sm text-gray-600">
                The better we understand your priorities, the better we can recommend the PPM tools that will set you up for success.
              </p>
            </div>
          </div>

          {/* Criteria List */}
          <div className="section-scroll flex-1 min-h-0 overflow-y-auto" data-lenis-prevent style={{ overflowX: 'visible' }}>
            <div className="p-6 pb-24"> {/* Added extra bottom padding to match ToolSection */}
              <DraggableList
                items={criteria}
                onReorder={onCriteriaChange}
                getItemId={(criterion) => criterion.id}
                renderItem={(criterion) => (
                  <div key={criterion.id} className="pl-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {criterion.name}
                          </h3>
                          {isTouchDevice ? (
                            <MobileTooltip 
                              content={
                                <div className="break-words">
                                  {getTooltipDescription(criterion)}
                                </div>
                              }
                              side="top"
                              align="center"
                              className="max-w-xs text-sm"
                            >
                              <button 
                                type="button"
                                className="text-gray-400 hover:text-gray-600 active:text-gray-700 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                                aria-label={`More information about ${criterion.name}`}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </MobileTooltip>
                          ) : (
                            <EnhancedDesktopTooltip
                              content={
                                <div className="break-words">
                                  {getTooltipDescription(criterion)}
                                </div>
                              }
                              side="top"
                              align="center"
                              className="max-w-xs text-sm"
                              delay={300}
                            >
                              <button 
                                type="button"
                                className="text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center -m-1 p-1 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-alpine-blue-400 focus:ring-opacity-50"
                                aria-label={`More information about ${criterion.name}`}
                                tabIndex={0}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </EnhancedDesktopTooltip>
                          )}
                        </div>
                      </div>
                      <div data-lenis-prevent>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Slider
                              value={[criterion.userRating]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={sliderCallbacks[criterion.id]}
                            />
                          </div>
                          <div className="flex items-center justify-end min-w-[30px]">
                            <span className="text-alpine-blue-600 font-semibold text-lg">{criterion.userRating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Importance level</span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>


        </div>
      </div>
    </>
  );
};