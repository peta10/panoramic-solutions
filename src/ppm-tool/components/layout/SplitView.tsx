import React from 'react';
import { CriteriaSection } from '@/ppm-tool/features/criteria/components/CriteriaSection';
import { ToolSection } from '@/ppm-tool/features/tools/ToolSection';
import { Tool, Criterion } from '@/ppm-tool/shared/types';
import { FilterCondition } from '@/ppm-tool/components/filters/FilterSystem';
import { useMobileDetection } from '@/ppm-tool/shared/hooks/useMobileDetection';

interface SplitViewProps {
  criteria: Criterion[];
  selectedTools: Tool[];
  removedTools: Tool[];
  filterConditions: FilterCondition[];
  filterMode: 'AND' | 'OR';
  onCriteriaChange: (criteria: Criterion[]) => void;
  onToolSelect: (tool: Tool) => void;
  onToolRemove: (toolId: string) => void;
  onRestoreAllTools: () => void;
  onAddFilterCondition: () => void;
  onRemoveFilterCondition: (id: string) => void;
  onUpdateFilterCondition: (id: string, updates: Partial<FilterCondition>) => void;
  onToggleFilterMode: () => void;
  tools: Tool[];
  onCompare?: (tool: Tool) => void;
  comparedTools?: Set<string>;
  guidedButtonRef?: React.RefObject<HTMLButtonElement>;
  onOpenGuidedRanking?: () => void;
  chartButtonPosition?: { x: number; y: number };
}

export const SplitView: React.FC<SplitViewProps> = ({
  criteria,
  selectedTools,
  removedTools,
  filterConditions,
  filterMode,
  onCriteriaChange,
  onToolSelect,
  onToolRemove,
  onRestoreAllTools,
  onAddFilterCondition,
  onRemoveFilterCondition,
  onUpdateFilterCondition,
  onToggleFilterMode,
  tools,
  onCompare,
  comparedTools,
  guidedButtonRef,
  onOpenGuidedRanking,
  chartButtonPosition
}) => {
  const isMobile = useMobileDetection();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'} h-[calc(100dvh-180px)] min-h-[400px] max-h-[800px] overflow-hidden rounded-lg bg-white shadow-sm`}>
      {/* Criteria Section */}
      <div className="h-full min-h-0">
        <CriteriaSection
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          startWithGuidedQuestions={false}
          guidedButtonRef={guidedButtonRef}
          onOpenGuidedRanking={onOpenGuidedRanking}
        />
      </div>

      {/* Tools and Recommendations Section */}
      <div className="h-full min-h-0">
        <ToolSection
          tools={tools}
          selectedTools={selectedTools}
          removedTools={removedTools}
          selectedCriteria={criteria}
          filterConditions={filterConditions}
          filterMode={filterMode}
          onAddFilterCondition={onAddFilterCondition}
          onRemoveFilterCondition={onRemoveFilterCondition}
          onUpdateFilterCondition={onUpdateFilterCondition}
          onToggleFilterMode={onToggleFilterMode}
          onToolSelect={onToolSelect}
          onToolRemove={onToolRemove}
          onRestoreAll={onRestoreAllTools}
          onCompare={onCompare}
          comparedTools={comparedTools}
          chartButtonPosition={chartButtonPosition}
        />
      </div>
    </div>
  );
}; 