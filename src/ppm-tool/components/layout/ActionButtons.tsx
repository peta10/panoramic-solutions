'use client';

import React, { useState } from 'react';
import { Send, Calendar } from 'lucide-react';
import { useFullscreen } from '@/ppm-tool/shared/contexts/FullscreenContext';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { EmailCaptureModal } from '@/ppm-tool/components/forms/EmailCaptureModal';
import { generateReport } from '@/ppm-tool/shared/utils/pdfExport';
import type { Tool, Criterion } from '@/ppm-tool/shared/types';

interface ActionButtonsProps {
  selectedTools?: Tool[];
  selectedCriteria?: Criterion[];
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  selectedTools = [], 
  selectedCriteria = [] 
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

  const handleBookCall = () => {
    window.open('https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt', '_blank');
  };

  // Mobile version - fixed bottom bar
  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Safe area padding for modern mobile devices */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg p-3 pb-safe">
            <div className="flex gap-3 max-w-lg mx-auto">
              <button
                onClick={handleGetReport}
                className={cn(
                  "flex-1 bg-alpine-blue-400 text-white px-4 py-3 rounded-xl font-medium text-sm",
                  "flex items-center justify-center gap-2",
                  "active:scale-95 transition-transform",
                  "shadow-sm active:shadow-inner hover:bg-alpine-blue-500"
                )}
              >
                <Send className="w-4 h-4" />
                Get my Free Comparison Report
              </button>
              <button
                onClick={handleBookCall}
                className={cn(
                  "flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-medium text-sm",
                  "flex items-center justify-center gap-2",
                  "active:scale-95 transition-transform",
                  "shadow-sm active:shadow-inner"
                )}
              >
                <Calendar className="w-4 h-4" />
                Book a Call
              </button>
            </div>
          </div>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          isLoading={isGeneratingPDF}
        />
      </>
    );
  }

  // Desktop version - inline buttons
  return (
    <>
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={handleGetReport}
          className="bg-alpine-blue-400 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 hover:bg-alpine-blue-500 transition-colors"
        >
          <Send className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Get my Free Comparison Report</span>
          <span className="sm:hidden">Get Report</span>
        </button>
        <button
          onClick={handleBookCall}
          className="bg-green-600 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
          Book a Call
        </button>
      </div>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isGeneratingPDF}
      />
    </>
  );
}; 