'use client';

import { useState, useRef } from 'react';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { EmbeddedPPMToolFlow } from '@/ppm-tool/components/common/EmbeddedPPMToolFlow';
// REMOVED: FullscreenProvider - no longer needed, using simple mobile detection
import { GuidanceProvider } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { HowItWorksOverlay } from '@/ppm-tool/components/overlays/HowItWorksOverlay';
import { LegalDisclaimer } from '@/ppm-tool/components/common/LegalDisclaimer';

// Temporarily disable force-dynamic to fix deployment inconsistencies
// export const dynamic = 'force-dynamic';

export default function PPMToolPage() {
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
          {/* PPM Tool Section */}
          <div className="min-h-screen" style={{ backgroundColor: '#F0F4FE' }}>
            <EmbeddedPPMToolFlow 
              onOpenGuidedRanking={handleOpenGuidedRanking}
              guidedButtonRef={guidedButtonRef}
              showGuidedRanking={showGuidedRanking}
              onGuidedRankingComplete={handleGuidedRankingComplete}
              onShowHowItWorks={handleShowHowItWorks}
            />
            
            <HowItWorksOverlay
              isVisible={showHowItWorks}
              onGetStarted={handleGetStarted}
              onManualRanking={handleManualRanking}
              onClose={() => setShowHowItWorks(false)}
            />

            {/* Legal Disclaimer - Inside the PPM tool container */}
            <div className="container mx-auto px-4 pb-6">
              <LegalDisclaimer />
            </div>
          </div>
        </GuidanceProvider>
    </ErrorBoundary>
  );
}
