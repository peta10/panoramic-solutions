'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { getProductBumperState, dismissProductBumper } from '@/ppm-tool/shared/utils/productBumperState';

interface GuidanceContextType {
  showManualGuidance: boolean;
  triggerManualGuidance: () => void;
  closeManualGuidance: () => void;
  hasShownManualGuidance: boolean;
  showProductBumper: boolean;
  triggerProductBumper: () => void;
  closeProductBumper: () => void;
  hasShownProductBumper: boolean;
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
  
  // Product bumper state
  const [internalShowProductBumper, setInternalShowProductBumper] = useState(false);
  const [hasShownProductBumper, setHasShownProductBumper] = useState(() => {
    if (typeof window !== 'undefined') {
      const state = getProductBumperState();
      return state.dismissed;
    }
    return false;
  });

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
    
    // Check if already showing or has been shown
    const canShow = !internalShowProductBumper && !hasShownProductBumper;
    
    if (canShow) {
      console.log('✅ Showing ProductBumper');
      setInternalShowProductBumper(true);
      setHasShownProductBumper(true);
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



  return (
    <GuidanceContext.Provider value={{
      showManualGuidance,
      triggerManualGuidance,
      closeManualGuidance,
      hasShownManualGuidance,
      showProductBumper,
      triggerProductBumper,
      closeProductBumper,
      hasShownProductBumper
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