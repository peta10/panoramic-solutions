'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

interface ExitIntentBumperProps {
  isVisible: boolean;
  onClose: () => void;
  triggerType?: 'mouse-leave' | 'tab-switch';
}

export const ExitIntentBumper: React.FC<ExitIntentBumperProps> = ({
  isVisible,
  onClose,
  triggerType = 'mouse-leave'
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate popup position when visible - position near header button
  useEffect(() => {
    if (isVisible) {
      const updatePosition = () => {
        // Position near the header button - shifted left and down
        const viewportTop = 160; // Further down from header
        const viewportLeft = window.innerWidth * 0.65; // More to the left
        
        setPosition({
          top: viewportTop,
          left: viewportLeft
        });
      };
      
      // Update position immediately
      updatePosition();
      
      // Update position on resize
      const handleResize = () => {
        requestAnimationFrame(updatePosition);
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  const getMessage = () => {
    switch (triggerType) {
      case 'mouse-leave':
        return "Wait! Don't leave without your personalized PPM tool comparison report.";
      case 'tab-switch':
        return "Don't lose your progress! Get your free comparison report before you go.";
      default:
        return "Get your personalized PPM tool comparison report in just 2 minutes.";
    }
  };

  const getSubMessage = () => {
    switch (triggerType) {
      case 'mouse-leave':
        return "Our research-backed analysis will help you choose the right tool for your needs.";
      case 'tab-switch':
        return "Save your personalized recommendations and avoid costly trial-and-error.";
      default:
        return "Get expert insights on the best PPM tools for your specific requirements.";
    }
  };

  const popupVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full-page backdrop with stronger blur */}
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-[8px] z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Exit Intent Popup - Positioned near header button */}
          <motion.div
            ref={popupRef}
            className="fixed z-50" 
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: 'translateX(-50%)',
              maxWidth: '380px',
              width: 'calc(100vw - 32px)',
              minWidth: '320px',
              zIndex: 50
            }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full overflow-hidden relative">
              {/* Arrow pointing up to header button */}
              <div 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"
                style={{ zIndex: -1 }}
              />
              
              {/* Header - Professional styling matching ProductBumper */}
              <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Get My Free Comparison Report
                    </h2>
                    <p className="text-sm text-gray-500">Personalized PPM tool analysis</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close exit intent popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content - Professional styling */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  {getMessage()}
                </p>
                
                <p className="text-xs text-gray-500">
                  Takes just 2 minutes • Research-backed analysis
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
