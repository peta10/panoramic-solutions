'use client';

import { useState, useRef } from 'react';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { EmbeddedPPMToolFlow } from '@/ppm-tool/components/common/EmbeddedPPMToolFlow';
import { FullscreenProvider } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { GuidanceProvider } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { HowItWorksOverlay } from '@/ppm-tool/components/overlays/HowItWorksOverlay';
import { LegalDisclaimer } from '@/ppm-tool/components/common/LegalDisclaimer';

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic';

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
      <FullscreenProvider>
        <GuidanceProvider>
          {/* PPM Tool Section - Full Height */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
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

            {/* Legal Disclaimer - Positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 pb-4">
              <LegalDisclaimer />
            </div>
          </div>
        </GuidanceProvider>
      </FullscreenProvider>
    </ErrorBoundary>
  );
}
