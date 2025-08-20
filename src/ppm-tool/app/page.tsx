'use client';

import { useState, useRef } from 'react';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { EmbeddedPPMToolFlow } from '@/ppm-tool/components/common/EmbeddedPPMToolFlow';
import { FullscreenProvider } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { GuidanceProvider } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { HowItWorksOverlay } from '@/ppm-tool/components/overlays/HowItWorksOverlay';

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false); // Changed from auto-popup to manual trigger
  const [showGuidedRanking, setShowGuidedRanking] = useState(false);
  const guidedButtonRef = useRef<HTMLButtonElement>(null);

  const handleGetStarted = () => {
    setShowHowItWorks(false);
    setShowGuidedRanking(true); // Directly open guided ranking
  };

  const handleManualRanking = () => {
    setShowHowItWorks(false);
    // Go directly to manual tool selection
  };

  const handleGuidedRankingComplete = () => {
    setShowGuidedRanking(false);
  };

  const handleOpenGuidedRanking = () => {
    setShowGuidedRanking(true);
  };

  const handleShowHowItWorks = () => {
    setShowHowItWorks(true);
  };

  return (
    <ErrorBoundary>
      <GuidanceProvider>
        <FullscreenProvider>
          <div className="min-h-screen bg-background" role="main">
            <EmbeddedPPMToolFlow 
              showGuidedRanking={showGuidedRanking}
              onGuidedRankingComplete={handleGuidedRankingComplete}
              onOpenGuidedRanking={handleOpenGuidedRanking}
              onShowHowItWorks={handleShowHowItWorks}
              guidedButtonRef={guidedButtonRef}
            />
            
            {/* How It Works Overlay - triggered manually via button */}
            <HowItWorksOverlay
              isVisible={showHowItWorks}
              onClose={() => setShowHowItWorks(false)}
              onGetStarted={handleGetStarted}
              onManualRanking={handleManualRanking}
            />
          </div>
        </FullscreenProvider>
      </GuidanceProvider>
    </ErrorBoundary>
  );
}
