'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolCompareAnimationProps {
  isAnimating: boolean;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

export const ToolCompareAnimation: React.FC<ToolCompareAnimationProps> = ({
  isAnimating,
  startPosition,
  onComplete
}) => {
  const handleAnimationComplete = () => {
    // Don't trigger glow here - let the main compare handler decide
    // based on whether tool was added or removed
    onComplete();
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ 
            opacity: 1,
            scale: 1,
            x: startPosition.x,
            y: startPosition.y
          }}
          animate={{ 
            opacity: [1, 0.8, 0],
            scale: [1, 0.5, 0.3],
            x: window.innerWidth / 2,
            y: 40 // Approximate position of the Chart toggle
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed top-0 left-0 w-8 h-8 bg-alpine-blue-500 rounded-full z-50 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}; 