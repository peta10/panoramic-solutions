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
          
          
          
                     {/* Enhanced Popup positioned near Guided Rankings button */}
           <motion.div
             ref={popupRef}
             className="fixed inset-0 z-[60] flex items-start justify-center p-8 pt-56" 
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