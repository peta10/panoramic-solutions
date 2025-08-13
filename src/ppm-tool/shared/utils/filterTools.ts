import { Tool } from '../types';
import { FilterCondition } from '@/ppm-tool/components/filters/FilterSystem';
import { getToolRating } from './toolRating';

export const filterTools = (
  tools: Tool[],
  conditions: FilterCondition[],
  filterMode: 'AND' | 'OR',
  includeRemoved: boolean = false
): Tool[] => {  
  // Filter out incomplete conditions
  const validConditions = conditions.filter(condition => {
    if (!condition.type || !condition.value) {
      console.debug('Filter condition skipped: missing type or value', condition);
      return false;
    }
    
    if (condition.type === 'Criteria') {
      const isValid = condition.operator !== undefined && 
                     condition.rating !== undefined && 
                     condition.rating !== null;
      
      if (!isValid) {
        console.debug('Criteria filter condition skipped: missing operator or rating', condition);
      }
      return isValid;
    }
    
    return true;
  });

  if (validConditions.length === 0) {
    console.debug('No valid filter conditions, returning all tools');
    return tools;
  }

  console.debug('Applying filters:', validConditions, 'Mode:', filterMode);

  return tools.filter(tool => {
    // Skip filtering for removed tools if not explicitly included
    if (!includeRemoved && tool.removed) return false;

    const results = validConditions.map(condition => {
      switch (condition.type) {
        case 'Methodology': {
          // Define tool exclusions for each methodology
          const methodologyExclusions: Record<string, string[]> = {
            'Waterfall': ['Azure DevOps', 'Jira'],
            'Agile': ['Smartsheet', 'Monday.com', 'ClickUp', 'Asana', 'MS Project', 'Hive', 'Adobe Workfront'],
            'Continuous Improvement': ['ClickUp', 'Asana', 'MS Project', 'Azure DevOps', 'Jira']
          };
          
          const excludedTools = methodologyExclusions[condition.value] || [];
          const isExcluded = excludedTools.includes(tool.name);
          console.debug(`Methodology filter for ${tool.name}: ${condition.value} -> ${isExcluded ? 'excluded' : 'included'}`);
          return !isExcluded;
        }
        
        case 'Criteria': {
          const rating = getToolRating(tool, condition.value);
          const targetRating = condition.rating || 0;
          const operator = condition.operator;
          
          let result = false;
          switch (operator) {
            case '>': 
              result = rating > targetRating;
              break;
            case '>=': 
              result = rating >= targetRating;
              break;
            case '=': 
              result = rating === targetRating;
              break;
            case '<=': 
              result = rating <= targetRating;
              break;
            case '<': 
              result = rating < targetRating;
              break;
            default: 
              result = false;
              console.warn('Unknown operator in criteria filter:', operator);
          }
          
          console.debug(`Criteria filter for ${tool.name}: ${condition.value} ${operator} ${targetRating} (actual: ${rating}) -> ${result ? 'pass' : 'fail'}`);
          return result;
        }
        
        default:
          console.warn('Unknown filter type:', condition.type);
          return true;
      }
    });
    
    const finalResult = filterMode === 'AND' 
      ? results.every(Boolean)
      : results.some(Boolean);
      
    console.debug(`Tool ${tool.name} filter result:`, finalResult, 'Results:', results);
    return finalResult;
  });
};