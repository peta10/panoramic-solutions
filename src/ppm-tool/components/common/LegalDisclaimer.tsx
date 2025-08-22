import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ppm-tool/components/ui/tooltip';
import { useTouchDevice } from '@/ppm-tool/shared/hooks/useTouchDevice';

export const LegalDisclaimer: React.FC = () => {
  const isTouchDevice = useTouchDevice();
  
  const detailedDisclaimer = `The information is:

• Based on user-provided criteria, publicly available information & independent research
• Generated through an automated scoring system
• Not a guarantee of product performance or suitability
• Subject to change without notice

Tool rankings and features may vary based on version, implementation, and specific use cases. Users should:

• Conduct their own due diligence
• Test tools in their specific environment
• Consult with vendors for current specifications
• Consider professional advice for critical decisions`;

  return (
    <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
      <div className="flex items-start space-x-2">
        <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`text-sm text-gray-700 cursor-help ${
                    isTouchDevice ? 'touch-manipulation' : ''
                  }`}
                  style={isTouchDevice ? { touchAction: 'manipulation' } : undefined}
                >
                  <span className="font-medium">Disclaimer:</span> The recommendations and match scores provided are for informational purposes only and do not constitute professional advice.{' '}
                  <span className="underline decoration-dotted underline-offset-2">
                    {isTouchDevice ? 'Tap' : 'Click or hover'} for additional details
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                align="start"
                className="max-w-md p-4 text-sm bg-gray-900 text-white rounded-lg shadow-lg"
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={isTouchDevice ? 16 : 8}
              >
                <div className="whitespace-pre-line">{detailedDisclaimer}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
