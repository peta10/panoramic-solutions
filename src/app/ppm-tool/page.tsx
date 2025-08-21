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
          {/* Header-style Landing Section */}
          <section style={{ backgroundColor: '#F0F4FE' }} className="border-b border-gray-200/50 pt-24">
            <div className="container mx-auto px-3 md:px-4 py-4">
              <div className="flex flex-col items-center text-center">
                {/* Main Title */}
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-midnight mb-3">
                  <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tight">PPM Tool Finder</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-sm md:text-base text-midnight/70 max-w-4xl">
                  Get <strong>100% free personalized recommendations</strong> with our intelligent <strong>Project Portfolio Management</strong> Tool assessment.
                </p>
              </div>
            </div>
          </section>

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
          </div>

          {/* Legal Disclaimer - Outside the PPM tool container */}
          <div className="bg-gray-50 py-6">
            <div className="container mx-auto px-4">
              <LegalDisclaimer />
            </div>
          </div>
        </GuidanceProvider>
      </FullscreenProvider>
    </ErrorBoundary>
  );
}
