'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface GuidanceContextType {
  showManualGuidance: boolean;
  triggerManualGuidance: () => void;
  closeManualGuidance: () => void;
  hasShownManualGuidance: boolean;
  showProductBumper: boolean;
  triggerProductBumper: () => void;
  closeProductBumper: () => void;
  hasShownProductBumper: boolean;
  mouseTrackingEnabled: boolean;
  delayTimerActive: boolean;
  startDelayTimer: () => void;
  isDelayComplete: boolean;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

interface GuidanceProviderProps {
  children: ReactNode;
  showProductBumper?: boolean;
}

export const GuidanceProvider = ({ children, showProductBumper: externalShowProductBumper }: GuidanceProviderProps) => {
  // Check localStorage for ProductBumper interaction
  const [showManualGuidance, setShowManualGuidance] = useState(false);
  const [hasShownManualGuidance, setHasShownManualGuidance] = useState(false);
  const [internalShowProductBumper, setInternalShowProductBumper] = useState(false);
  const [hasShownProductBumper, setHasShownProductBumper] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('productBumperDismissed') === 'true';
    }
    return false;
  });
  const [mouseTrackingEnabled, setMouseTrackingEnabled] = useState(false);
  const [delayTimerActive, setDelayTimerActive] = useState(false);
  const [isDelayComplete, setIsDelayComplete] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

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
    
    // Check localStorage first
    if (typeof window !== 'undefined' && localStorage.getItem('productBumperDismissed') === 'true') {
      console.log('⛔ ProductBumper permanently dismissed via localStorage');
      return;
    }
    
    if (!internalShowProductBumper && !hasShownProductBumper) {
      console.log('✅ Showing ProductBumper');
      setInternalShowProductBumper(true);
      setHasShownProductBumper(true);
    } else {
      console.log('⚠️ ProductBumper already shown or visible, skipping...');
    }
  };

  const closeProductBumper = () => {
    setInternalShowProductBumper(false);
    // Mark as permanently dismissed in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('productBumperDismissed', 'true');
      console.log('💾 ProductBumper permanently dismissed - saved to localStorage');
    }
    setHasShownProductBumper(true);
  };

  const startDelayTimer = useCallback(() => {
    console.log('🔍 startDelayTimer called - current state:', { 
      timerStarted, 
      dismissed: typeof window !== 'undefined' ? localStorage.getItem('productBumperDismissed') : 'unknown' 
    });
    
    if (timerStarted) {
      console.log('⚠️ Timer already started, skipping...');
      return;
    }
    
    // Check if ProductBumper is permanently dismissed
    if (typeof window !== 'undefined' && localStorage.getItem('productBumperDismissed') === 'true') {
      console.log('⛔ ProductBumper permanently dismissed - skipping timer');
      return;
    }
    
    console.log('🕐 Starting 30-second delay timer before mouse tracking');
    setTimerStarted(true);
    setDelayTimerActive(true);
    setIsDelayComplete(false);
    
    setTimeout(() => {
      console.log('✅ 30-second delay complete - mouse tracking now enabled');
      setDelayTimerActive(false);
      setIsDelayComplete(true);
      setMouseTrackingEnabled(true);
    }, 30000); // 30 seconds
  }, [timerStarted]);

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
      mouseTrackingEnabled,
      delayTimerActive,
      startDelayTimer,
      isDelayComplete
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