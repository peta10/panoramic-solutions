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
import { supabase } from '@/lib/supabase';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { useMobileDetection } from '@/ppm-tool/shared/hooks/useMobileDetection';
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
// REMOVED: import { MobileDiagnostics } from './MobileDiagnostics'; - Causes browser compatibility issues
import { MobileRecoverySystem } from './MobileRecoverySystem';

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
  // Simple, reliable mobile detection
  const isMobile = useMobileDetection();
  
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
  // Set initial step based on mobile detection - move logic outside hook
  const getInitialStep = () => {
    try {
      return isMobile ? 'criteria' : 'criteria-tools';
    } catch (error) {
      console.warn('Error determining mobile state, defaulting to criteria-tools:', error);
      return 'criteria-tools';
    }
  };
  
  const [currentStep, setCurrentStep] = useState<string>(getInitialStep());
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

  // Enhanced localStorage handling with cross-browser compatibility
  useEffect(() => {
    try {
      // Check if localStorage is available and working
      if (typeof window === 'undefined' || typeof Storage === 'undefined') {
        console.warn('localStorage not available');
        return;
      }
      
      // Test localStorage functionality
      try {
        const testKey = '__ppm_tool_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (storageError) {
        console.warn('localStorage not working properly:', storageError);
        return;
      }
      
      const savedAnswers = localStorage.getItem('guidedRankingAnswers');
      const savedPersonalization = localStorage.getItem('personalizationData');
      
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);
          setGuidedRankingAnswers(parsedAnswers);
        } catch (parseError) {
          console.warn('Error parsing saved answers, clearing:', parseError);
          localStorage.removeItem('guidedRankingAnswers');
        }
      }
      
      if (savedPersonalization) {
        try {
          const parsedPersonalization = JSON.parse(savedPersonalization);
          setPersonalizationData(parsedPersonalization);
        } catch (parseError) {
          console.warn('Error parsing saved personalization, clearing:', parseError);
          localStorage.removeItem('personalizationData');
        }
      }
    } catch (error) {
      console.error('Error loading saved guided ranking data:', error);
      // Clear potentially corrupted data
      try {
        localStorage.removeItem('guidedRankingAnswers');
        localStorage.removeItem('personalizationData');
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
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

  // Enhanced criteria fetching with mobile-friendly error handling
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        // Check if supabase is available
        if (!supabase) {
          console.warn('Supabase not available, using default criteria');
          const transformedDefaultCriteria: Criterion[] = defaultCriteria.map(item => ({
            ...item,
            description: item.tooltipDescription || 'No description available'
          }));
          setCriteria(transformedDefaultCriteria);
          return;
        }

        const { data, error } = await supabase
          .from('criteria')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          console.log('✅ Fetched criteria from database:', data);
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
          
          if (sortedCriteria.length > 0) {
            console.log('✅ Using database criteria:', sortedCriteria.length, 'items');
            setCriteria(sortedCriteria);
          } else {
            throw new Error('No valid criteria found in database');
          }
        } else {
          throw new Error('No criteria data received from database');
        }
      } catch (err) {
        console.error('Error fetching criteria, using defaults:', err);
        setFetchError(null); // Clear any existing fetch errors for criteria
        
        // Fallback to default criteria
        try {
          const transformedDefaultCriteria: Criterion[] = defaultCriteria.map(item => ({
            ...item,
            description: item.tooltipDescription || 'No description available'
          }));
          
          if (transformedDefaultCriteria.length > 0) {
            console.log('✅ Using default criteria:', transformedDefaultCriteria.length, 'items');
            setCriteria(transformedDefaultCriteria);
          } else {
            throw new Error('Default criteria is empty');
          }
        } catch (fallbackError) {
          console.error('Critical error: Cannot load default criteria:', fallbackError);
          setFetchError('Unable to load tool criteria. Please refresh the page.');
        }
      }
    };

    // Delay execution slightly to allow mobile browsers to settle
    const timeoutId = setTimeout(fetchCriteria, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Enhanced tools fetching with mobile-friendly error handling
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setFetchError(null);

        // Check if supabase is available
        if (!supabase) {
          console.warn('Supabase not available, using default tools');
          setSelectedTools(defaultTools);
          return;
        }

        const { data, error } = await supabase
          .from('tools_view')
          .select('*')
          .eq('type', 'application')
          .eq('submission_status', 'approved');

        if (error) {
          throw error;
        }

        if (data && Array.isArray(data)) {
          console.log('✅ Fetched approved tools:', data.length, 'tools');
          
          if (data.length > 0) {
            try {
              const transformedTools = data.map(transformDatabaseTool).filter(tool => tool && tool.id);
              
              if (transformedTools.length > 0) {
                console.log('✅ Using database tools:', transformedTools.length, 'items');
                setSelectedTools(transformedTools);
              } else {
                throw new Error('No valid tools after transformation');
              }
            } catch (transformError) {
              console.error('Error transforming tools, using defaults:', transformError);
              setSelectedTools(defaultTools);
            }
          } else {
            console.warn('No tools found in database, using defaults');
            setSelectedTools(defaultTools);
          }
        } else {
          throw new Error('No tools data received from database');
        }
      } catch (err) {
        console.error('Error fetching tools, using defaults:', err);
        
        // Always have fallback tools available
        try {
          if (defaultTools && defaultTools.length > 0) {
            console.log('✅ Using default tools:', defaultTools.length, 'items');
            setSelectedTools(defaultTools);
            setFetchError(null); // Don't show error if we have fallback data
          } else {
            throw new Error('No default tools available');
          }
        } catch (fallbackError) {
          console.error('Critical error: No tools available:', fallbackError);
          setFetchError('Unable to load tools. Please check your connection and refresh the page.');
        }
      }
    };

    // Delay execution to allow mobile browsers to settle
    const timeoutId = setTimeout(fetchTools, 200);
    return () => clearTimeout(timeoutId);
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

  // Throttled real-time update for background preview to prevent infinite loops
  const handleRealTimeUpdate = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (rankings: { [key: string]: number }) => {
        // Clear previous timeout to debounce rapid updates
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Only update rankings that were actually set by the guided form
          setCriteria(prevCriteria => {
            // Check if any changes are actually needed to prevent unnecessary re-renders
            const hasChanges = prevCriteria.some(criterion => 
              rankings[criterion.id] !== undefined && rankings[criterion.id] !== criterion.userRating
            );
            
            if (!hasChanges) return prevCriteria;
            
            return prevCriteria.map(criterion => ({
              ...criterion,
              userRating: rankings[criterion.id] !== undefined ? rankings[criterion.id] : criterion.userRating
            }));
          });
        }, 100); // 100ms debounce to prevent rapid fire updates
      };
    }, []),
    []
  );

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
        <div className="min-h-[25rem] flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Issue</h3>
            <p className="text-gray-600 mb-4">
              The tool is having trouble loading on your device. This might be due to viewport size issues on mobile devices.
            </p>
            <div className="space-y-2">
                          <button
              onClick={() => {
                try {
                  console.log('Attempting to reload page...');
                  window.location.reload();
                } catch (reloadError) {
                  console.error('Reload failed:', reloadError);
                  window.location.href = window.location.href;
                }
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mobile-button"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                try {
                  console.log('Clearing all data and reloading...');
                  // Clear specific PPM tool data
                  const keysToRemove = [
                    'guidedRankingAnswers',
                    'personalizationData',
                    'lastPPMError',
                    '__ppm_tool_test__'
                  ];
                  
                  keysToRemove.forEach(key => {
                    try {
                      localStorage.removeItem(key);
                    } catch (e) {
                      console.warn(`Failed to remove ${key}:`, e);
                    }
                  });
                  
                  // Force reload
                  setTimeout(() => {
                    try {
                      window.location.reload();
                    } catch (reloadError) {
                      window.location.href = '/ppm-tool';
                    }
                  }, 100);
                  
                } catch (e) {
                  console.error('Clear data failed:', e);
                  try {
                    window.location.href = '/ppm-tool';
                  } catch (navError) {
                    window.location.reload();
                  }
                }
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm mobile-button"
            >
              Clear Data & Reload
            </button>
            {isMobile && (
              <button
                onClick={() => {
                  try {
                    // Mobile-specific recovery
                    console.log('Attempting mobile recovery...');
                    
                    // Try to navigate to desktop version
                    const currentUrl = window.location.href;
                    const desktopUrl = currentUrl.includes('?') 
                      ? currentUrl + '&mobile=0' 
                      : currentUrl + '?mobile=0';
                    
                    window.location.href = desktopUrl;
                  } catch (e) {
                    console.error('Mobile recovery failed:', e);
                    window.location.href = '/';
                  }
                }}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm mobile-button"
              >
                Try Desktop Version
              </button>
            )}
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
        {/* PPM Tool Embedded Application */}
        <div 
          className="min-h-screen rounded-lg"
          style={{ backgroundColor: '#F0F4FE' }}
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
              paddingTop: isMobile ? "var(--header-height-mobile, 15rem)" : "var(--header-height-desktop, 11.25rem)" // Direct use of REM variables to avoid conflicts
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

        {/* REMOVED: Mobile Diagnostics - Causes browser compatibility issues with Edge/Safari
            <MobileDiagnostics /> */}

        {/* Mobile Recovery System */}
        {isMobile && (
          <MobileRecoverySystem 
            onRecovery={() => {
              console.log('🔧 Mobile recovery initiated');
              // Reset all state
              setCriteria([]);
              setSelectedTools([]);
              setFetchError(null);
            }}
          />
        )}

    </ErrorBoundary>
  );
}; 