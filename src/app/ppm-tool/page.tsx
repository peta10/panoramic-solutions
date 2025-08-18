'use client';

import { useState, useRef } from 'react';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { EmbeddedPPMToolFlow } from '@/ppm-tool/components/common/EmbeddedPPMToolFlow';
import { FullscreenProvider } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { GuidanceProvider } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { HowItWorksOverlay } from '@/ppm-tool/components/overlays/HowItWorksOverlay';
import { Zap, Users, Target, TrendingUp } from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic';

export default function PPMToolPage() {
  const [showHowItWorks, setShowHowItWorks] = useState(true); // Show on initial load
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

  return (
    <ErrorBoundary>
      <FullscreenProvider>
        <GuidanceProvider>
          {/* Landing Page Section */}
          <section className="bg-gradient-to-br from-slate-50 to-indigo-50 pt-32 pb-12">
            <div className="container mx-auto px-4 text-center">
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-midnight">
                Find Your Perfect <span className="text-alpine-blue-400">PPM Tool</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-midnight/70 max-w-4xl mx-auto mb-12 leading-relaxed">
                Get 100% free personalized recommendations in minutes with our intelligent Project Portfolio Management Tool assessment. Make informed decisions and focus on key features identified through deep research for lasting project portfolio success.
              </p>

              {/* Feature Tabs - Made Much Smaller */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {/* Instant Intelligence */}
                <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-midnight/5">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-4 w-4 text-alpine-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-midnight mb-1">
                    Instant Intelligence
                  </h3>
                  <p className="text-midnight/60 text-xs leading-relaxed">
                    Get recommendations in minutes, not months
                  </p>
                </div>

                {/* Proven Methodology */}
                <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-midnight/5">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-4 w-4 text-alpine-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-midnight mb-1">
                    Proven Methodology
                  </h3>
                  <p className="text-midnight/60 text-xs leading-relaxed">
                    Designed using real-world implementations across industries
                  </p>
                </div>

                {/* Tailored Results */}
                <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-midnight/5">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-4 w-4 text-alpine-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-midnight mb-1">
                    Tailored Results
                  </h3>
                  <p className="text-midnight/60 text-xs leading-relaxed">
                    Recommendations specific to your organization's needs
                  </p>
                </div>

                {/* Start on Course */}
                <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-midnight/5">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-4 w-4 text-alpine-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-midnight mb-1">
                    Start on Course
                  </h3>
                  <p className="text-midnight/60 text-xs leading-relaxed">
                    Leverage our deep research and avoid costly tool selection mistakes
                  </p>
                </div>
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
            />
            
            <HowItWorksOverlay
              isVisible={showHowItWorks}
              onGetStarted={handleGetStarted}
              onManualRanking={handleManualRanking}
              onClose={() => setShowHowItWorks(false)}
            />
          </div>
        </GuidanceProvider>
      </FullscreenProvider>
    </ErrorBoundary>
  );
}
