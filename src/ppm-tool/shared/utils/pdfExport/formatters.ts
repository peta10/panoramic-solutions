import { Tool, Criterion } from '../../types';
import { getToolRating, calculateScore } from '../toolRating';

export const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateToolScore = (tool: Tool, criteria: Criterion[]) => {
  return calculateScore(tool, criteria);
};

export const getTopPerformerStrengths = (tool: Tool, criteria: Criterion[]): string => {
  const strengths = criteria
    .filter(c => getToolRating(tool, c) >= 4)
    .map(c => c.name)
    .slice(0, 3);
  
  return strengths.join(', ');
};