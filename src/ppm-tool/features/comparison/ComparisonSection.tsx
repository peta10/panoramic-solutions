import React from 'react';
import { Tool, Criterion } from '@/ppm-tool/shared/types';
import { ComparisonChart } from '@/ppm-tool/components/charts/ComparisonChart';
import { useFullscreen } from '@/ppm-tool/shared/contexts/FullscreenContext';

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
  const { fullscreenView } = useFullscreen();
  const isFullscreen = fullscreenView === 'chart';

  return (
    <ComparisonChart
      tools={selectedTools}
      criteria={selectedCriteria}
      isFullscreen={isFullscreen}
      comparedTools={comparedTools}
    />
  );
};