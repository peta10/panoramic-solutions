'use client';

import React, { useState } from 'react';
import { Send, HelpCircle } from 'lucide-react';
import { useFullscreen } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { EmailCaptureModal } from '@/ppm-tool/components/forms/EmailCaptureModal';
import { generateReport } from '@/ppm-tool/shared/utils/pdfExport';
import type { Tool, Criterion } from '@/ppm-tool/shared/types';

interface ActionButtonsProps {
  selectedTools?: Tool[];
  selectedCriteria?: Criterion[];
  filteredTools?: Tool[];
  onShowHowItWorks?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  selectedTools = [], 
  selectedCriteria = [],
  filteredTools = [],
  onShowHowItWorks
}) => {
  const { isMobile } = useFullscreen();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const handleGetReport = () => {
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate and download the PDF report
      await generateReport(selectedTools, selectedCriteria);
      
      // Close modal after successful download
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      // Keep modal open so user can try again
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Mobile version - fixed bottom bar
  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Safe area padding for modern mobile devices */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg p-3 pb-safe">
            <div className="flex gap-2 justify-center max-w-lg mx-auto">
              {/* How It Works Button - Blue (Mobile) */}
              {onShowHowItWorks && (
                <button
                  onClick={onShowHowItWorks}
                  className={cn(
                    "flex-1 bg-blue-400 text-white px-3 py-3 rounded-xl font-medium text-sm",
                    "flex items-center justify-center gap-2",
                    "active:scale-95 transition-transform",
                    "shadow-sm active:shadow-inner hover:bg-blue-500"
                  )}
                >
                  <HelpCircle className="w-4 h-4" />
                  How It Works
                </button>
              )}
              {/* Get Report Button - Blue (Mobile) */}
              <button
                onClick={handleGetReport}
                className={cn(
                  `${onShowHowItWorks ? 'flex-1' : 'w-full'} bg-blue-400 text-white px-4 py-3 rounded-xl font-medium text-sm`,
                  "flex items-center justify-center gap-2", 
                  "active:scale-95 transition-transform",
                  "shadow-sm active:shadow-inner hover:bg-blue-500"
                )}
              >
                <Send className="w-4 h-4" />
                Get my Free Comparison Report
              </button>
            </div>
          </div>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          isLoading={isGeneratingPDF}
          selectedTools={filteredTools.length > 0 ? filteredTools : selectedTools}
          selectedCriteria={selectedCriteria}
        />
      </>
    );
  }

  // Desktop version - inline buttons
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        {/* How It Works - Plain Text */}
        {onShowHowItWorks && (
          <button
            onClick={onShowHowItWorks}
            className="text-alpine-blue-400 text-xs md:text-sm font-medium flex items-center gap-2 hover:text-alpine-blue-500 transition-colors"
          >
            <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">How It Works</span>
          </button>
        )}
        
        <button
          onClick={handleGetReport}
          className="bg-alpine-blue-400 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 hover:bg-alpine-blue-500 transition-colors"
        >
          <Send className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Get my Free Comparison Report</span>
          <span className="sm:hidden">Get Report</span>
        </button>
      </div>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isGeneratingPDF}
        selectedTools={filteredTools.length > 0 ? filteredTools : selectedTools}
        selectedCriteria={selectedCriteria}
      />
    </>
  );
}; 