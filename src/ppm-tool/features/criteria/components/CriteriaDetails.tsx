import React from 'react';
import { Tool, Criterion } from '../../../shared/types';
import { getToolRating } from '../../../shared/utils/toolRating';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

interface CriteriaDetailsProps {
  tool: Tool;
  selectedCriteria: Criterion[];
}

export const CriteriaDetails: React.FC<CriteriaDetailsProps> = ({
  tool,
  selectedCriteria,
}) => {
  return (
    <TooltipProvider>
      <div className="space-y-3">
        {selectedCriteria.map((criterion) => {
          const rating = getToolRating(tool, criterion);
          
          // Get description from tool criteria array
          const criterionData = Array.isArray(tool.criteria) 
            ? tool.criteria.find(c => c.id === criterion.id)
            : null;
          const description = criterionData?.description || '';

          return (
            <div key={criterion.id} className="text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">
                    {criterion.name}
                  </span>
                  {criterion.tooltipDescription && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button"
                          className="text-gray-400 hover:text-gray-600 active:text-gray-700 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                          aria-label={`More information about ${criterion.name}`}
                          onTouchStart={() => {}}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        align="center"
                        className="max-w-xs text-sm bg-gray-900 text-white p-3 rounded-lg shadow-lg z-[100] border border-gray-700"
                        sideOffset={12}
                        avoidCollisions={true}
                        collisionPadding={16}
                      >
                        <div className="break-words">
                          {criterion.tooltipDescription}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <span
                  className={`font-semibold ${
                    rating >= 4
                      ? 'text-green-600'
                      : rating >= 3
                      ? 'text-alpine-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  {rating}/5
                </span>
              </div>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
