import React from 'react';
import { MethodologyTag } from './MethodologyTag';
import { Tool } from '@/ppm-tool/shared/types';

interface MethodologyTagsProps {
  tool: Tool;
  className?: string;
}

export const MethodologyTags: React.FC<MethodologyTagsProps> = ({ 
  tool, 
  className = '' 
}) => {
  // Filter tags to only show methodology tags
  const methodologyTags = (tool.tags || []).filter(tag => 
    tag.type === 'Methodology'
  );

  if (methodologyTags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {methodologyTags.map((tag) => (
        <MethodologyTag
          key={tag.id}
          methodology={tag.name}
        />
      ))}
    </div>
  );
}; 