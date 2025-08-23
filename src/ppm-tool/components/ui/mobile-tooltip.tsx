import React, { useState, useRef, useEffect } from 'react';
import { useTouchDevice } from '@/ppm-tool/shared/hooks/useTouchDevice';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface MobileTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const MobileTooltip: React.FC<MobileTooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useTouchDevice();

  // Only use custom tooltip on touch devices
  if (!isTouchDevice) {
    // Fall back to Radix UI tooltip for desktop
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side={side} align={align} className={className}>
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => setIsOpen(false), 4000);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      // Calculate position based on side and align
      switch (side) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          switch (align) {
            case 'start':
              left = triggerRect.left;
              break;
            case 'end':
              left = triggerRect.right - tooltipRect.width;
              break;
            default: // center
              left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          }
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          switch (align) {
            case 'start':
              left = triggerRect.left;
              break;
            case 'end':
              left = triggerRect.right - tooltipRect.width;
              break;
            default: // center
              left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          }
          break;
        case 'left':
          left = triggerRect.left - tooltipRect.width - 8;
          switch (align) {
            case 'start':
              top = triggerRect.top;
              break;
            case 'end':
              top = triggerRect.bottom - tooltipRect.height;
              break;
            default: // center
              top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          }
          break;
        case 'right':
          left = triggerRect.right + 8;
          switch (align) {
            case 'start':
              top = triggerRect.top;
              break;
            case 'end':
              top = triggerRect.bottom - tooltipRect.height;
              break;
            default: // center
              top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          }
          break;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 8) left = 8;
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = viewportHeight - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, side, align]);

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={handleClick}>
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`fixed z-[9999] bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-xs border border-gray-700 ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
