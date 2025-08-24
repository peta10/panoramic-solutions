'use client';

import React, { useState, useEffect } from 'react';
import { NavigationToggle } from '@/ppm-tool/components/layout/NavigationToggle';
import { SplitView } from '@/ppm-tool/components/layout/SplitView';
import { ComparisonChart } from '@/ppm-tool/components/charts/ComparisonChart';
import { defaultCriteria } from '@/ppm-tool/data/criteria';
import { defaultTools } from '@/ppm-tool/data/tools';
import { Tool, Criterion, CriteriaRating, Tag } from '@/ppm-tool/shared/types';
import { FilterCondition } from '@/ppm-tool/components/filters/FilterSystem';
import { filterTools } from '@/ppm-tool/shared/utils/filterTools';
import { supabase } from '@/ppm-tool/shared/lib/supabase';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { FullscreenProvider, useFullscreen } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { useLenis } from '@/ppm-tool/shared/hooks/useLenis';
import { CriteriaSection } from '@/ppm-tool/features/criteria/components/CriteriaSection';
import { ToolSection } from '@/ppm-tool/features/tools/ToolSection';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { ActionButtons } from '@/ppm-tool/components/layout/ActionButtons';
import { GuidedRankingForm } from '@/ppm-tool/components/forms/GuidedRankingForm';
import { ProductBumper } from '@/ppm-tool/components/overlays/ProductBumper';
import { useGuidance } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { 
  shouldShowProductBumper, 
  dismissProductBumper, 
  incrementShowCount,
  markInitialTimerComplete,
  recordMouseMovement,
  getTimingConstants,
  resetProductBumperState,
  getProductBumperState
} from '@/ppm-tool/shared/utils/productBumperState';
import { MobileDiagnostics } from './MobileDiagnostics';

interface EmbeddedPPMToolFlowProps {
  showGuidedRanking?: boolean;
  onGuidedRankingComplete?: () => void;
  onOpenGuidedRanking?: () => void;
  onShowHowItWorks?: () => void;
  guidedButtonRef?: React.RefObject<HTMLButtonElement>;
}

interface DbCriterion {
  id: string;
  ranking: number;
  description?: string;
}

interface DbTag {
  name: string;
  tag_type: {
    name: string;
  };
}

interface DbTool {
  id: string;
  name: string;
  type: string;
  created_by: string;
  criteria: DbCriterion[];
  tags: DbTag[];
  created_on: string;
  updated_at: string;
  submitted_at?: string;
  approved_at?: string;
  submission_status?: string;
}

interface GuidedRankingAnswer {
  value: number | number[] | string;
  timestamp: string;
}

interface PersonalizationData {
  userCount?: number;
  departments?: string[];
  methodologies?: string[];
  timestamp: string;
}

export const EmbeddedPPMToolFlow: React.FC<EmbeddedPPMToolFlowProps> = ({
  showGuidedRanking = false,
  onGuidedRankingComplete,
  onOpenGuidedRanking,
  onShowHowItWorks,
  guidedButtonRef
}) => {
  const { isMobile: fullscreenIsMobile } = useFullscreen();
  
  // Add fallback mobile detection with error handling
  const isMobile = React.useMemo(() => {
    try {
      if (typeof window === 'undefined') return false;
      
      // Multiple mobile detection methods for reliability
      const userAgent = navigator.userAgent || '';
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isMobileScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window;
      
      return fullscreenIsMobile || isMobileUserAgent || (isMobileScreen && isTouchDevice);
    } catch (error) {
      console.warn('Error detecting mobile device, defaulting to desktop:', error);
      return false;
    }
  }, [fullscreenIsMobile]);
  
  // Disable Lenis smooth scroll on mobile to prevent tooltip interference
  useLenis({
    disabled: isMobile, // Completely disable Lenis on mobile devices
    isMobile: isMobile
  });
  
  const { 
    showProductBumper, 
    closeProductBumper, 
    triggerProductBumper,
    hasShownProductBumper
  } = useGuidance();

  // Debug logging for guidance state (only log when state changes)
  useEffect(() => {
    console.log('🔍 EmbeddedPPMToolFlow guidance state changed:', {
      showProductBumper,
      hasShownProductBumper
    });
  }, [showProductBumper, hasShownProductBumper]);

  // Add global class to body when ProductBumper is visible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (showProductBumper) {
        document.body.classList.add('product-bumper-active');
      } else {
        document.body.classList.remove('product-bumper-active');
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('product-bumper-active');
      }
    };
  }, [showProductBumper]);
  // Set initial step based on mobile/desktop view with safety check
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      return isMobile ? 'criteria' : 'criteria-tools';
    } catch (error) {
      console.warn('Error determining mobile state, defaulting to criteria-tools:', error);
      return 'criteria-tools';
    }
  });
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>(defaultTools);
  const [removedCriteria, setRemovedCriteria] = useState<Criterion[]>([]);
  const [removedTools, setRemovedTools] = useState<Tool[]>([]);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [comparedTools, setComparedTools] = useState<Set<string>>(new Set());
  const [chartButtonPosition, setChartButtonPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add state for guided ranking answers and personalization data
  const [guidedRankingAnswers, setGuidedRankingAnswers] = useState<Record<string, GuidedRankingAnswer>>({});
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({
    timestamp: new Date().toISOString()
  });

  // Load saved answers and personalization data from localStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('guidedRankingAnswers');
      const savedPersonalization = localStorage.getItem('personalizationData');
      
      if (savedAnswers) {
        setGuidedRankingAnswers(JSON.parse(savedAnswers));
      }
      if (savedPersonalization) {
        setPersonalizationData(JSON.parse(savedPersonalization));
      }
    } catch (error) {
      console.error('Error loading saved guided ranking data:', error);
    }
  }, []);

  // Save answers and personalization data to localStorage
  const handleSaveAnswers = (
    answers: Record<string, number | number[] | string>,
    personalization: Record<string, number | number[] | string>
  ) => {
    try {
      // Format guided ranking answers with timestamps
      const formattedAnswers: Record<string, GuidedRankingAnswer> = {};
      Object.entries(answers).forEach(([key, value]) => {
        formattedAnswers[key] = {
          value,
          timestamp: new Date().toISOString()
        };
      });

      // Format personalization data
      const formattedPersonalization: PersonalizationData = {
        userCount: personalization.q10 as number,
        departments: Array.isArray(personalization.q11) ? personalization.q11.map(String) : [],
        methodologies: Array.isArray(personalization.q12) ? personalization.q12.map(String) : [],
        timestamp: new Date().toISOString()
      };

      // Update state
      setGuidedRankingAnswers(formattedAnswers);
      setPersonalizationData(formattedPersonalization);
      
      // Save to localStorage
      localStorage.setItem('guidedRankingAnswers', JSON.stringify(formattedAnswers));
      localStorage.setItem('personalizationData', JSON.stringify(formattedPersonalization));

      // Log the data for analytics (you can integrate with your analytics system here)
      console.log('Guided Ranking Answers:', formattedAnswers);
      console.log('Personalization Data:', formattedPersonalization);
    } catch (error) {
      console.error('Error saving guided ranking data:', error);
    }
  };

  // Update currentStep when mobile state changes with error handling
  useEffect(() => {
    try {
      if (isMobile && currentStep === 'criteria-tools') {
        setCurrentStep('criteria');
      } else if (!isMobile && ['criteria', 'tools'].includes(currentStep)) {
        setCurrentStep('criteria-tools');
      }
    } catch (error) {
      console.warn('Error updating step based on mobile state:', error);
      // Keep current step if there's an error
    }
  }, [isMobile, currentStep]);

  // Transform database tool to match Tool type
  const transformDatabaseTool = (dbTool: DbTool): Tool => {
    const ratings: Record<string, number> = {};
    const ratingExplanations: Record<string, string> = {};
    const methodologies: string[] = [];
    const functions: string[] = [];

    try {
      // Process criteria ratings and explanations
      if (Array.isArray(dbTool.criteria)) {
        dbTool.criteria.forEach((criterion: DbCriterion) => {
          if (criterion && criterion.id && typeof criterion.ranking === 'number') {
            ratings[criterion.id] = criterion.ranking;
            if (criterion.description) {
              ratingExplanations[criterion.id] = criterion.description;
            }
          }
        });
      }

      // Process tags for methodologies and functions
      if (Array.isArray(dbTool.tags)) {
        dbTool.tags.forEach((tag: DbTag) => {
          if (tag && tag.name && tag.tag_type) {
            if (tag.tag_type.name === 'Methodology') {
              methodologies.push(tag.name);
            } else if (tag.tag_type.name === 'Function') {
              functions.push(tag.name);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error processing tool data:', error);
    }

    return {
      id: dbTool.id,
      name: dbTool.name,
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop',
      useCases: Array.from(new Set([...methodologies, ...functions])),
      methodologies,
      functions,
      ratings,
      ratingExplanations,
      type: dbTool.type,
      created_by: dbTool.created_by,
      criteria: (dbTool.criteria || []) as unknown as CriteriaRating[],
      tags: (dbTool.tags || []) as unknown as Tag[],
      created_on: dbTool.created_on,
      updated_at: dbTool.updated_at,
      submitted_at: dbTool.submitted_at,
      approved_at: dbTool.approved_at,
      submission_status: dbTool.submission_status || 'approved',
    };
  };

  // Fetch criteria from database
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const { data, error } = await supabase
          .from('criteria')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          console.log('Fetched criteria from database:', data);
          // Transform database criteria to match Criterion type, using defaultCriteria for descriptions
          const transformedCriteria: Criterion[] = data.map((item: any) => {
            // Find matching default criterion for descriptions
            const defaultCriterion = defaultCriteria.find(dc => dc.name === item.name);
            return {
              id: item.id, // Use the actual UUID from database
              name: item.name,
              description: defaultCriterion?.tooltipDescription || 'No description available',
              tooltipDescription: defaultCriterion?.tooltipDescription,
              userRating: 3, // Default rating
              ratingDescriptions: defaultCriterion?.ratingDescriptions || {
                low: 'Basic functionality',
                high: 'Advanced features'
              }
            };
          });
          
          // Sort criteria in the desired order
          const desiredOrder = [
            'Scalability',
            'Integrations & Extensibility', 
            'Ease of Use',
            'Flexibility & Customization',
            'Portfolio Management',
            'Reporting & Analytics',
            'Security & Compliance'
          ];
          
          const sortedCriteria = desiredOrder.map(name => 
            transformedCriteria.find(criterion => criterion.name === name)
          ).filter(Boolean) as Criterion[];
          
          console.log('✅ Transformed criteria with tooltips:', sortedCriteria.length, 'items');
          setCriteria(sortedCriteria);
        }
      } catch (err) {
        console.error('Error fetching criteria:', err);
        // Fallback to default criteria if database fetch fails
        // Transform defaultCriteria to match Criterion type
        const transformedDefaultCriteria: Criterion[] = defaultCriteria.map(item => ({
          ...item,
          description: item.tooltipDescription || 'No description available'
        }));
        setCriteria(transformedDefaultCriteria);
      }
    };

    fetchCriteria();
  }, []);

  // Fetch tools from database
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setFetchError(null);

        const { data, error } = await supabase
          .from('tools_view')
          .select('*')
          .eq('type', 'application')
          .eq('submission_status', 'approved');

        if (error) {
          throw error;
        }

        if (data) {
          console.log('Fetched approved tools:', data.length, 'tools');
          const transformedTools = data.map(transformDatabaseTool);
          setSelectedTools(transformedTools);
        }
      } catch (err) {
        console.error('Error fetching tools:', err);
        setFetchError('Failed to load tools. Please try again later.');
      }
    };

    fetchTools();
  }, []);

  // Product bumper timing strategy: 23s initial timer + 3s mouse movement timer (only on first page)
  useEffect(() => {
    const { INITIAL_TIMER_MS, MOUSE_MOVEMENT_TIMER_MS } = getTimingConstants();
    let initialTimer: NodeJS.Timeout;
    let mouseMovementTimer: NodeJS.Timeout;
    
    // Only show ProductBumper on the first page (not on chart comparison page)
    const isFirstPage = currentStep === 'criteria' || currentStep === 'criteria-tools';
    
    if (!isFirstPage) {
      console.log('📄 Not on first page - ProductBumper disabled');
      return;
    }
    
    // Start 23-second initial timer immediately when component mounts
    initialTimer = setTimeout(() => {
      console.log('🕐 Initial 23-second timer complete - marking timer complete');
      markInitialTimerComplete();
    }, INITIAL_TIMER_MS);

    // Set up mouse movement tracking
    const trackMouseMovement = (e: MouseEvent) => {
      // Record mouse movement and start 3-second timer
      recordMouseMovement();
      
      // Clear existing timer
      if (mouseMovementTimer) {
        clearTimeout(mouseMovementTimer);
      }
      
      // Start 3-second timer for mouse movement
      mouseMovementTimer = setTimeout(() => {
        console.log('🖱️ 3 seconds after mouse movement - checking if should show ProductBumper');
        const state = getProductBumperState();
        console.log('📊 ProductBumper state check:', {
          dismissed: state.dismissed,
          initialTimerComplete: state.initialTimerComplete,
          mouseMovementDetected: state.mouseMovementDetected,
          showProductBumper: showProductBumper,
          currentStep: currentStep
        });
        
        // Check if we should show the ProductBumper
        const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                                 (typeof window !== 'undefined' && window.location.hostname === 'localhost');
        
        const shouldShow = isDevelopmentMode ? 
          (state.initialTimerComplete && !showProductBumper) : 
          (!state.dismissed && state.initialTimerComplete && !showProductBumper);
        
        if (shouldShow) {
          console.log('🎯 Triggering ProductBumper after mouse movement timer' + (isDevelopmentMode ? ' [DEV MODE]' : ''));
          incrementShowCount();
          triggerProductBumper();
        } else {
          console.log('⚠️ ProductBumper not triggered:', {
            dismissed: state.dismissed,
            initialTimerComplete: state.initialTimerComplete,
            alreadyShowing: showProductBumper,
            developmentMode: isDevelopmentMode,
            currentStep: currentStep
          });
        }
      }, MOUSE_MOVEMENT_TIMER_MS);
    };

    // Shift+Click testing trigger
    const testProductBumperClick = (e: MouseEvent) => {
      if (e.shiftKey) {
        console.log('🧪 Shift+Click detected - resetting and triggering ProductBumper for testing');
        resetProductBumperState();
        triggerProductBumper();
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', trackMouseMovement);
    document.addEventListener('click', testProductBumperClick);

    console.log('🕐 ProductBumper: Starting 23-second initial timer (first page only)...');
    console.log('🧪 To test ProductBumper: Shift+Click anywhere');

    return () => {
      document.removeEventListener('mousemove', trackMouseMovement);
      document.removeEventListener('click', testProductBumperClick);
      if (initialTimer) clearTimeout(initialTimer);
      if (mouseMovementTimer) clearTimeout(mouseMovementTimer);
    };
  }, [triggerProductBumper, showProductBumper, currentStep]);

  // Close ProductBumper when navigating away from first page
  useEffect(() => {
    const isFirstPage = currentStep === 'criteria' || currentStep === 'criteria-tools';
    if (!isFirstPage && showProductBumper) {
      console.log('📄 Navigating away from first page - closing ProductBumper');
      closeProductBumper();
    }
  }, [currentStep, showProductBumper, closeProductBumper]);

  const filteredTools = filterTools(selectedTools, filterConditions, filterMode);

  // Handlers for criteria
  const handleCriteriaChange = (newCriteria: Criterion[]) => {
    setCriteria(newCriteria);
  };

  // Handlers for tools
  const handleToolSelect = (tool: Tool) => {
    setSelectedTools([...selectedTools, tool]);
  };

  const handleRestoreAllTools = () => {
    setSelectedTools([...selectedTools, ...removedTools]);
    setRemovedTools([]);
    // Also clear all filter conditions and reset filter mode
    setFilterConditions([]);
    setFilterMode('AND');
  };

  const handleToolRemove = (toolId: string) => {
    const toolToRemove = selectedTools.find((t) => t.id === toolId);
    if (toolToRemove) {
      setSelectedTools(selectedTools.filter((t) => t.id !== toolId));
      setRemovedTools([...removedTools, toolToRemove]);
    }
  };

  // Handlers for filters
  const handleAddFilterCondition = () => {
    setFilterConditions([
      ...filterConditions,
      { id: Date.now().toString(), type: 'Methodology', value: '' },
    ]);
  };

  const handleRemoveFilterCondition = (id: string) => {
    setFilterConditions(filterConditions.filter((c) => c.id !== id));
  };

  const handleUpdateFilterCondition = (
    id: string,
    updates: Partial<FilterCondition>
  ) => {
    setFilterConditions(
      filterConditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleToggleFilterMode = () => {
    setFilterMode(filterMode === 'AND' ? 'OR' : 'AND');
  };

  // Update criteria rankings from guided form
  const handleUpdateRankings = (rankings: { [key: string]: number }) => {
    // Only update rankings that were actually set by the guided form
    setCriteria(prevCriteria => 
      prevCriteria.map(criterion => ({
        ...criterion,
        userRating: rankings[criterion.id] !== undefined ? rankings[criterion.id] : criterion.userRating
      }))
    );
    onGuidedRankingComplete?.();
  };

  // Real-time update for background preview
  const handleRealTimeUpdate = (rankings: { [key: string]: number }) => {
    // Only update rankings that were actually set by the guided form
    setCriteria(prevCriteria => 
      prevCriteria.map(criterion => ({
        ...criterion,
        userRating: rankings[criterion.id] !== undefined ? rankings[criterion.id] : criterion.userRating
      }))
    );
  };

  const handleCompare = (tool: Tool) => {
    setComparedTools(prev => {
      const newSet = new Set(prev);
      const isCurrentlySelected = newSet.has(tool.id);
      
      if (isCurrentlySelected) {
        // Tool is being REMOVED - no glow
        newSet.delete(tool.id);
      } else {
        // Tool is being ADDED - trigger glow
        newSet.add(tool.id);
        window.dispatchEvent(new CustomEvent('chartToggleGlow'));
      }
      return newSet;
    });
  };

  // Show loading state
  // if (isLoading) {
  //   return <AppLoadingScreen />;
  // }

  // Show error state
  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="glass-card p-4 border-l-4 border-l-red-500 bg-red-50/80">
          <div className="text-red-700 font-medium">{fetchError}</div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    try {
      if (isMobile) {
        switch (currentStep) {
          case 'criteria':
            return (
              <div className="mobile-height-fix overflow-y-auto bg-white rounded-lg shadow-sm border">
                <CriteriaSection
                  criteria={criteria}
                  onCriteriaChange={handleCriteriaChange}
                  startWithGuidedQuestions={false}
                  guidedButtonRef={guidedButtonRef}
                  onOpenGuidedRanking={onOpenGuidedRanking}
                />
              </div>
            );
                  case 'tools':
            return (
              <div className="mobile-height-fix overflow-y-auto bg-white rounded-lg shadow-sm border">
                <ToolSection
                  tools={defaultTools}
                  selectedTools={filteredTools}
                  removedTools={removedTools}
                  selectedCriteria={criteria}
                  filterConditions={filterConditions}
                  filterMode={filterMode}
                  onAddFilterCondition={handleAddFilterCondition}
                  onRemoveFilterCondition={handleRemoveFilterCondition}
                  onUpdateFilterCondition={handleUpdateFilterCondition}
                  onToggleFilterMode={handleToggleFilterMode}
                  onToolSelect={handleToolSelect}
                  onToolRemove={handleToolRemove}
                  onRestoreAll={handleRestoreAllTools}
                  onCompare={handleCompare}
                  comparedTools={comparedTools}
                  chartButtonPosition={chartButtonPosition}
                />
              </div>
            );
        case 'chart':
          return (
            <div className="mobile-height-fix overflow-y-auto bg-white rounded-lg shadow-sm border">
              <ComparisonChart
                tools={filteredTools}
                criteria={criteria}
                comparedTools={comparedTools}
              />
            </div>
          );
        default:
          return null;
        }
      }

      switch (currentStep) {
      case 'criteria-tools':
        return (
          <SplitView
            criteria={criteria}
            selectedTools={selectedTools}
            removedTools={removedTools}
            filterConditions={filterConditions}
            filterMode={filterMode}
            onCriteriaChange={handleCriteriaChange}
            onToolSelect={handleToolSelect}
            onToolRemove={handleToolRemove}
            onRestoreAllTools={handleRestoreAllTools}
            onAddFilterCondition={handleAddFilterCondition}
            onRemoveFilterCondition={handleRemoveFilterCondition}
            onUpdateFilterCondition={handleUpdateFilterCondition}
            onToggleFilterMode={handleToggleFilterMode}
            tools={defaultTools}
            onCompare={handleCompare}
            comparedTools={comparedTools}
            guidedButtonRef={guidedButtonRef}
            onOpenGuidedRanking={onOpenGuidedRanking}
            chartButtonPosition={chartButtonPosition}
          />
        );
      case 'chart':
        return (
          <div className="h-[calc(100dvh-120px)] min-h-[400px] max-h-[800px] overflow-y-auto bg-white rounded-lg shadow-sm border">
            <ComparisonChart
              tools={filteredTools}
              criteria={criteria}
              comparedTools={comparedTools}
            />
          </div>
        );
      default:
        return null;
      }
    } catch (error) {
      console.error('Error rendering PPM Tool content:', error);
      
      // Store error for diagnostics
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lastPPMError', `${error?.toString()} - ${new Date().toISOString()}`);
        } catch (storageError) {
          // Ignore storage errors
        }
      }
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Issue</h3>
            <p className="text-gray-600 mb-4">
              The tool is having trouble loading on your device. This might be due to viewport size issues on mobile devices.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  // Clear all localStorage and reload
                  try {
                    localStorage.clear();
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Clear Data & Reload
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <FullscreenProvider>
        {/* PPM Tool Embedded Application */}
        <div 
          className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg"
          role="application"
          aria-label="PPM Tool Finder"
        >
          <NavigationToggle
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            compareCount={comparedTools.size}
            selectedTools={selectedTools}
            selectedCriteria={criteria}
            filteredTools={filteredTools}
            onShowHowItWorks={onShowHowItWorks}
            isProductBumperVisible={showProductBumper}
            onChartButtonPosition={setChartButtonPosition}
          />
          <main 
            className={cn(
              "container mx-auto px-4 py-6",
              isMobile && "pb-28" // Increased padding to accommodate the action buttons
            )}
            style={{
              paddingTop: isMobile ? "var(--total-fixed-height, 240px)" : "var(--total-fixed-height, 180px)" // Increased fallbacks: mobile from 220px to 240px, desktop from 160px to 180px
            }}
          >
            {renderContent()}
          </main>
          {isMobile && (
            <ActionButtons 
              selectedTools={selectedTools} 
              selectedCriteria={criteria}
              filteredTools={filteredTools}
              onShowHowItWorks={onShowHowItWorks}
            />
          )}
        </div>

        {/* Guided Ranking Form */}
        <GuidedRankingForm
          isOpen={showGuidedRanking}
          onClose={onGuidedRankingComplete || (() => {})}
          criteria={criteria}
          onUpdateRankings={handleUpdateRankings}
          onRealTimeUpdate={handleRealTimeUpdate}
          onSaveAnswers={handleSaveAnswers}
        />

        {/* Product Bumper - guides users to guided ranking */}
        <ProductBumper
          isVisible={showProductBumper}
          onClose={closeProductBumper}
          onUseGuided={() => {
            closeProductBumper();
            onOpenGuidedRanking && onOpenGuidedRanking();
          }}
        />

        {/* Mobile Diagnostics for debugging */}
        <MobileDiagnostics />

      </FullscreenProvider>
    </ErrorBoundary>
  );
}; 