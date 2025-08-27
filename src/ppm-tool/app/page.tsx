'use client';

import { useState, useRef, useEffect } from 'react';
import { ErrorBoundary } from '@/ppm-tool/components/common/ErrorBoundary';
import { EmbeddedPPMToolFlow } from '@/ppm-tool/components/common/EmbeddedPPMToolFlow';
// REMOVED: FullscreenProvider - no longer needed, using simple mobile detection
import { GuidanceProvider } from '@/ppm-tool/shared/contexts/GuidanceContext';
import { HowItWorksOverlay } from '@/ppm-tool/components/overlays/HowItWorksOverlay';
import { usePostHog } from '@/hooks/usePostHog';

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false); // Changed from auto-popup to manual trigger
  const [showGuidedRanking, setShowGuidedRanking] = useState(false);
  const guidedButtonRef = useRef<HTMLButtonElement>(null);
  const { trackClick, trackTool, checkAndTrackVisitor, checkAndTrackActive } = usePostHog();

  // Track new visitor and active user on page load
  useEffect(() => {
    // Check and track new visitor
    checkAndTrackVisitor({
      page: 'ppm_tool',
      tool_type: 'portfolio_management'
    });

    // Track first interaction as active user
    const handleFirstInteraction = () => {
      checkAndTrackActive('page_interaction', {
        page: 'ppm_tool',
        interaction_type: 'page_load'
      });
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [checkAndTrackVisitor, checkAndTrackActive]);

  const handleGetStarted = () => {
    trackClick('get_started_button', { location: 'how_it_works_overlay' });
    trackTool('ppm_tool', 'started_guided_flow', { source: 'how_it_works' });
    setShowHowItWorks(false);
    setShowGuidedRanking(true); // Directly open guided ranking
  };

  const handleManualRanking = () => {
    trackClick('manual_ranking_button', { location: 'how_it_works_overlay' });
    trackTool('ppm_tool', 'started_manual_flow', { source: 'how_it_works' });
    setShowHowItWorks(false);
    // Go directly to manual tool selection
  };

  const handleGuidedRankingComplete = () => {
    trackTool('ppm_tool', 'guided_ranking_completed', { 
      source: 'guided_flow',
      completion_time: Date.now()
    });
    setShowGuidedRanking(false);
  };

  const handleOpenGuidedRanking = () => {
    trackClick('open_guided_ranking', { location: 'main_page' });
    trackTool('ppm_tool', 'opened_guided_ranking', { source: 'main_page' });
    setShowGuidedRanking(true);
  };

  const handleShowHowItWorks = () => {
    trackClick('show_how_it_works', { location: 'main_page' });
    trackTool('ppm_tool', 'viewed_how_it_works', { source: 'main_page' });
    setShowHowItWorks(true);
  };

  return (
    <ErrorBoundary>
      <GuidanceProvider>
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
      </GuidanceProvider>
    </ErrorBoundary>
  );
}
