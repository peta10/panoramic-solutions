'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProductBumperState, dismissProductBumper } from '@/ppm-tool/shared/utils/productBumperState';
import { getExitIntentState, dismissExitIntent } from '@/ppm-tool/shared/utils/exitIntentState';
import { 
  canShowProductBumper, 
  canShowExitIntentBumper, 
  recordBumperShown,
  markGuidedRankingActive,
  markGuidedRankingCompleted
} from '@/ppm-tool/shared/utils/bumperCoordination';

interface GuidanceContextType {
  showManualGuidance: boolean;
  triggerManualGuidance: () => void;
  closeManualGuidance: () => void;
  hasShownManualGuidance: boolean;
  showProductBumper: boolean;
  triggerProductBumper: () => void;
  closeProductBumper: () => void;
  hasShownProductBumper: boolean;
  showExitIntentBumper: boolean;
  triggerExitIntentBumper: (triggerType: 'mouse-leave' | 'tab-switch') => void;
  closeExitIntentBumper: () => void;
  hasShownExitIntentBumper: boolean;
  exitIntentTriggerType: 'mouse-leave' | 'tab-switch' | null;
  onGuidedRankingStart: () => void;
  onGuidedRankingComplete: () => void;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

interface GuidanceProviderProps {
  children: ReactNode;
  showProductBumper?: boolean;
}

export const GuidanceProvider = ({ children, showProductBumper: externalShowProductBumper }: GuidanceProviderProps) => {
  // Manual guidance state
  const [showManualGuidance, setShowManualGuidance] = useState(false);
  const [hasShownManualGuidance, setHasShownManualGuidance] = useState(false);
  
  // Product bumper state - avoid SSR/hydration mismatch
  const [internalShowProductBumper, setInternalShowProductBumper] = useState(false);
  const [hasShownProductBumper, setHasShownProductBumper] = useState(false);
  
  // Exit intent bumper state
  const [showExitIntentBumper, setShowExitIntentBumper] = useState(false);
  const [hasShownExitIntentBumper, setHasShownExitIntentBumper] = useState(false);
  const [exitIntentTriggerType, setExitIntentTriggerType] = useState<'mouse-leave' | 'tab-switch' | null>(null);
  
  // Set proper state after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This runs only on client after hydration
      const productBumperState = getProductBumperState();
      if (productBumperState.dismissed) {
        setHasShownProductBumper(true);
      }
      
      const exitIntentState = getExitIntentState();
      if (exitIntentState.dismissed) {
        setHasShownExitIntentBumper(true);
      }
    }
  }, []); // Run once on mount

  // Use external state if provided, otherwise use internal state
  const showProductBumper = externalShowProductBumper !== undefined ? externalShowProductBumper : internalShowProductBumper;

  const triggerManualGuidance = () => {
    if (!hasShownManualGuidance) {
      setShowManualGuidance(true);
      setHasShownManualGuidance(true);
    }
  };

  const closeManualGuidance = () => {
    setShowManualGuidance(false);
  };

  const triggerProductBumper = () => {
    console.log('🎯 triggerProductBumper called - current state:', { internalShowProductBumper, hasShownProductBumper });
    
    // Check if we're in development mode
    const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                             (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    // Always check localStorage for dismissed state
    if (typeof window !== 'undefined') {
      const state = getProductBumperState();
      if (state.dismissed) {
        console.log('⛔ ProductBumper permanently dismissed via localStorage');
        return;
      }
    }
    
    // Check bumper coordination rules
    if (!canShowProductBumper()) {
      console.log('⚠️ ProductBumper blocked by coordination rules');
      return;
    }
    
    // Check if already showing or has been shown
    const canShow = !internalShowProductBumper && !hasShownProductBumper;
    
    if (canShow) {
      console.log('✅ Showing ProductBumper');
      setInternalShowProductBumper(true);
      setHasShownProductBumper(true);
      recordBumperShown('product');
    } else {
      console.log('⚠️ ProductBumper already shown or visible, skipping...');
    }
  };

  const closeProductBumper = () => {
    const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                             (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    setInternalShowProductBumper(false);
    
    // Always dismiss to localStorage for persistence
    dismissProductBumper();
    console.log('💾 ProductBumper dismissed - saved to localStorage');
    setHasShownProductBumper(true);
    
    if (isDevelopmentMode) {
      console.log('🔄 ProductBumper closed [DEV MODE] - but still dismissed in localStorage');
    }
  };

  const triggerExitIntentBumper = (triggerType: 'mouse-leave' | 'tab-switch') => {
    console.log('🎯 triggerExitIntentBumper called - trigger type:', triggerType);
    
    // Check if we're in development mode
    const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                             (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    // Always check localStorage for dismissed state
    if (typeof window !== 'undefined') {
      const state = getExitIntentState();
      if (state.dismissed) {
        console.log('⛔ ExitIntentBumper permanently dismissed via localStorage');
        return;
      }
    }
    
    // Check bumper coordination rules (includes guided ranking and delay logic)
    if (!canShowExitIntentBumper()) {
      console.log('⚠️ ExitIntentBumper blocked by coordination rules');
      return;
    }
    
    // Check if already showing or has been shown
    const canShow = !showExitIntentBumper && !hasShownExitIntentBumper;
    
    if (canShow) {
      console.log('✅ Showing ExitIntentBumper');
      setExitIntentTriggerType(triggerType);
      setShowExitIntentBumper(true);
      setHasShownExitIntentBumper(true);
      recordBumperShown('exit-intent');
    } else {
      console.log('⚠️ ExitIntentBumper already shown or visible, skipping...');
    }
  };

  const closeExitIntentBumper = () => {
    const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                             (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    setShowExitIntentBumper(false);
    
    // Always dismiss to localStorage for persistence
    dismissExitIntent();
    console.log('💾 ExitIntentBumper dismissed - saved to localStorage');
    setHasShownExitIntentBumper(true);
    
    if (isDevelopmentMode) {
      console.log('🔄 ExitIntentBumper closed [DEV MODE] - but still dismissed in localStorage');
    }
  };

  const onGuidedRankingStart = () => {
    console.log('🎯 Guided ranking started - marking as active');
    markGuidedRankingActive();
  };

  const onGuidedRankingComplete = () => {
    console.log('🎯 Guided ranking completed - starting delay timer');
    markGuidedRankingCompleted();
  };

  return (
    <GuidanceContext.Provider value={{
      showManualGuidance,
      triggerManualGuidance,
      closeManualGuidance,
      hasShownManualGuidance,
      showProductBumper,
      triggerProductBumper,
      closeProductBumper,
      hasShownProductBumper,
      showExitIntentBumper,
      triggerExitIntentBumper,
      closeExitIntentBumper,
      hasShownExitIntentBumper,
      exitIntentTriggerType,
      onGuidedRankingStart,
      onGuidedRankingComplete
    }}>
      {children}
    </GuidanceContext.Provider>
  );
};

export function useGuidance() {
  const ctx = useContext(GuidanceContext);
  if (!ctx) throw new Error('useGuidance must be used within a GuidanceProvider');
  return ctx;
} 