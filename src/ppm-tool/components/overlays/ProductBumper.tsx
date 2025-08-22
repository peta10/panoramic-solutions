'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface ProductBumperProps {
  isVisible: boolean;
  onClose: () => void;
  onUseGuided: () => void;
}

export const ProductBumper: React.FC<ProductBumperProps> = ({
  isVisible,
  onClose,
  onUseGuided
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate connecting line coordinates
  const getConnectingLineCoords = () => {
    const guidedButton = document.querySelector('[data-guided-rankings-button]') as HTMLElement;
    const popup = popupRef.current;
    
    console.log('🔍 Connecting line debug:', {
      guidedButton: !!guidedButton,
      popup: !!popup,
      guidedButtonElement: guidedButton,
      popupElement: popup
    });
    
    if (!guidedButton || !popup) {
      console.log('❌ Missing elements for connecting line');
      return null;
    }

    const buttonRect = guidedButton.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    // Start point: from the top left of the popup
    const startX = popupRect.left;
    const startY = popupRect.top + 3000;
    
    // End point: center of the button but shorter distance
    const endX = buttonRect.left + (buttonRect.width / 2);
    const endY = buttonRect.top + (buttonRect.height / 2) - 100;
    
    console.log('📏 Line coordinates:', {
      startX, startY, endX, endY,
      buttonRect: buttonRect,
      popupRect: popupRect
    });
    
    return { startX, startY, endX, endY };
  };
  
  // Debug logging for ProductBumper render
  console.log('🎯 ProductBumper render - isVisible:', isVisible, 'isMobile:', isMobile);

  // Remove all button-specific positioning logic since this is now page-wide

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
      {isVisible && !isMobile && (
        <>
          {/* Simple full-page backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Connecting Line */}
          <motion.svg
            className="fixed inset-0 pointer-events-none"
            style={{ 
              width: '100vw', 
              height: '100vh',
              zIndex: 999 // Very high z-index to ensure visibility
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(() => {
              const coords = getConnectingLineCoords();
              if (!coords) {
                console.log('⚠️ No coordinates available for connecting line');
                return null;
              }
              
              const { startX, startY, endX, endY } = coords;
              
              // Create a straight line going down from popup to button
              console.log('🎨 Drawing line:', { startX, startY, endX, endY });
              return (
                <motion.g
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {/* Main connecting path - straight line */}
                  <path
                    d={`M ${startX} ${startY} L ${endX} ${endY}`}
                    stroke="#3B82F6"
                    strokeWidth="3"
                    fill="none"
                    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
                  />
                  {/* Arrow head pointing up to the button */}
                  <motion.polygon
                    points={`${endX},${endY} ${endX-5},${endY-10} ${endX+5},${endY-10}`}
                    fill="#3B82F6"
                    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 }}
                  />
                </motion.g>
              );
            })()}
          </motion.svg>
          
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Get Better Results!
                    {(process.env.NODE_ENV === 'development' || 
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost')) && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-normal">
                        DEV MODE
                      </span>
                    )}
                  </h2>
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