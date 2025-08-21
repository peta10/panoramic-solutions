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
          <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm pt-16">
            <div className="container mx-auto px-3 md:px-4 py-4">
              <div className="flex flex-col items-center text-center">
                {/* Main Title */}
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-midnight mb-3">
                  <span className="text-black font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tight">PPM Tool Finder</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-sm md:text-base text-midnight/70 max-w-4xl">
                  Get <strong>100% free personalized recommendations</strong> with our intelligent <strong>Project Portfolio Management</strong> Tool assessment.
                </p>
              </div>
            </div>
          </section>

          {/* PPM Tool Section */}
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
