import React from 'react';
import { Tool, Criterion } from '@/ppm-tool/shared/types';
import { ComparisonChart } from '@/ppm-tool/components/charts/ComparisonChart';
// REMOVED: FullscreenContext dependency

interface ComparisonSectionProps {
  tools: Tool[];
  criteria: Criterion[];
  comparedTools?: Set<string>;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  tools: selectedTools,
  criteria: selectedCriteria,
  comparedTools = new Set(),
}) => {
  // SIMPLIFIED: Always use standard layout (removed fullscreen complexity)

  return (
    <ComparisonChart
      tools={selectedTools}
      criteria={selectedCriteria}
      comparedTools={comparedTools}
    />
  );
};