'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface ProductBumperProps {
  isVisible: boolean;
  onClose: () => void;
  onUseGuided: () => void;
  guidedButtonRef?: React.RefObject<HTMLButtonElement>;
}

export const ProductBumper: React.FC<ProductBumperProps> = ({
  isVisible,
  onClose,
  onUseGuided,
  guidedButtonRef
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Debug logging for ProductBumper render
  console.log('🎯 ProductBumper render - isVisible:', isVisible);
  const [lineEndPoint, setLineEndPoint] = useState({ 
    startX: 0, 
    startY: 0, 
    endX: 0, 
    endY: 0 
  });
  
  const [buttonBounds, setButtonBounds] = useState({ 
    left: 0, 
    top: 0, 
    width: 0, 
    height: 0 
  });

  // Calculate line end point and button bounds when popup is visible
  useEffect(() => {
    if (isVisible && guidedButtonRef?.current && popupRef?.current) {
      const buttonRect = guidedButtonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      // Simple line: FROM button bottom DOWN to popup center
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonBottomY = buttonRect.top + buttonRect.height; // Button bottom Y
      const popupCenterX = popupRect.left + popupRect.width / 2; // Popup center X  
      const popupCenterY = popupRect.top + popupRect.height / 2; // Popup center Y
      
      setLineEndPoint({ 
        startX: buttonCenterX,    // Start at button center X
        startY: buttonBottomY,    // Start at button bottom
        endX: popupCenterX,       // End at popup center
        endY: popupCenterY        // End at popup center
      });
      
      setButtonBounds({
        left: buttonRect.left,
        top: buttonRect.top,
        width: buttonRect.width,
        height: buttonRect.height
      });
      
      console.log('Line points calculated:', { 
        start: { x: buttonCenterX, y: buttonBottomY },
        end: { x: popupCenterX, y: popupCenterY }
      });
    }
  }, [isVisible, guidedButtonRef]);

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



  return (
    <AnimatePresence>
      {isVisible && (
        <>

          
          {/* Backdrop with blur - split into sections to avoid blurring the button */}
          {buttonBounds.width > 0 ? (
            <>
              {/* Top section */}
              <motion.div 
                className="fixed bg-black/20 backdrop-blur-[2px] z-40"
                style={{
                  left: 0,
                  top: 0,
                  right: 0,
                  height: buttonBounds.top - 6
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              
              {/* Left section */}
              <motion.div 
                className="fixed bg-black/20 backdrop-blur-[2px] z-40"
                style={{
                  left: 0,
                  top: buttonBounds.top - 6,
                  width: buttonBounds.left - 6,
                  height: buttonBounds.height + 12
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              
              {/* Right section */}
              <motion.div 
                className="fixed bg-black/20 backdrop-blur-[2px] z-40"
                style={{
                  left: buttonBounds.left + buttonBounds.width + 6,
                  top: buttonBounds.top - 6,
                  right: 0,
                  height: buttonBounds.height + 12
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              
              {/* Bottom section */}
              <motion.div 
                className="fixed bg-black/20 backdrop-blur-[2px] z-40"
                style={{
                  left: 0,
                  top: buttonBounds.top + buttonBounds.height + 6,
                  right: 0,
                  bottom: 0
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
            </>
          ) : (
            /* Fallback full backdrop if button bounds not available */
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          
          {/* Highlight Box Around Button and Connection Line */}
          {guidedButtonRef?.current && lineEndPoint.startX > 0 && lineEndPoint.startY > 0 && buttonBounds.width > 0 && (
            <>
              {/* Subtle highlight border around the guided button */}
              <div 
                className="fixed pointer-events-none z-50"
                style={{
                  left: buttonBounds.left - 4,
                  top: buttonBounds.top - 4,
                  width: buttonBounds.width + 8,
                  height: buttonBounds.height + 8,
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
                }}
              />
              
              {/* Connection line */}
              <svg 
                className="fixed inset-0 w-full h-full pointer-events-none z-[55]"
                aria-hidden="true"
              >
                <line
                  x1={lineEndPoint.startX}
                  y1={lineEndPoint.startY}
                  x2={lineEndPoint.endX}
                  y2={lineEndPoint.endY}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </>
          )}
          

          
          {/* Enhanced Centered Popup with Accessibility */}
          <motion.div
            ref={popupRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-bumper-title"
            aria-describedby="product-bumper-description"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden z-10">
              
              {/* Header - Professional styling */}
              <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Get Better Results!</h2>
                  <p className="text-sm text-gray-500">Why guided ranking works better</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                  aria-label="Close guided ranking suggestion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content - Professional styling */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Our guided method ensures your rankings follow the same research-backed framework we use to evaluate tools.
                </p>

                <button
                  onClick={onUseGuided}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-lg font-medium transition-all"
                  aria-describedby="product-bumper-description"
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Use Guided Rankings
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 