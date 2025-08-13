import { Tool, Criterion } from '../../types';
import { jsPDF } from 'jspdf';

export const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getToolRating = (tool: Tool, criterionId: string | Criterion): number => {
  try {
    let criterion: Criterion | null = null;
    let id: string = '';
    if (typeof criterionId === 'object' && criterionId !== null) {
      criterion = criterionId;
      id = criterion.id;
    } else {
      id = criterionId;
    }
    // Always use backend criteria array
    if (Array.isArray(tool.criteria)) {
      const criterionDataById = tool.criteria.find(c => c.id === id);
      if (criterionDataById && typeof criterionDataById.ranking === 'number') {
        return criterionDataById.ranking;
      }
      if (criterion) {
        const criterionDataByName = tool.criteria.find(c => c.name === criterion.name);
        if (criterionDataByName && typeof criterionDataByName.ranking === 'number') {
          return criterionDataByName.ranking;
        }
      }
    }
    // If not found, return 0
    return 0;
  } catch (error) {
    console.warn(`Error getting rating for criterion ${criterionId}:`, error);
    return 0;
  }
};

export function averageFlexibilityScore(values: number[]): number {
  if (!values.length) return 0;
  // Calculate average and round to nearest 0.5
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg * 2) / 2;
}

export function getScalabilityScore(projects: number, tasks: number): number {
  // Projects ranges: <10, 10-29, 30-99, 100-499, 500+
  // Tasks ranges: <20, 20-99, 100-499, 500-999, 1000+
  // Always use upper bound for calculation
  const projectRanges = [10, 29, 99, 499, 500];
  const taskRanges = [20, 99, 499, 999, 1000];
  
  let projectValue = 0;
  let taskValue = 0;
  
  // Get upper bound for projects
  for (let i = 0; i < projectRanges.length; i++) {
    if (projects <= projectRanges[i]) {
      projectValue = projectRanges[i];
      break;
    }
  }
  
  // Get upper bound for tasks
  for (let i = 0; i < taskRanges.length; i++) {
    if (tasks <= taskRanges[i]) {
      taskValue = taskRanges[i];
      break;
    }
  }
  
  const totalVolume = projectValue * taskValue;
  
  // Score based on volume thresholds (user-specified bands)
  if (totalVolume >= 200000) return 5;  // ≥200,000 total = Score 5
  if (totalVolume >= 30000) return 4;   // 30,000-199,999 total = Score 4
  if (totalVolume >= 5000) return 3;    // 5,000-29,999 total = Score 3  
  if (totalVolume >= 500) return 2;     // 500-4,999 total = Score 2
  return 1;                             // <500 total = Score 1
}

export const calculateToolScore = (tool: Tool, criteria: Criterion[]): number => {
  try {
    let totalScore = 0;
    let meetsAllCriteria = true;

    criteria.forEach((criterion) => {
      // Get tool's capability rating (1-5) from criteria_tools table
      const toolRating = getToolRating(tool, criterion);
      
      // Get user's importance ranking (1-5) from user_criteria table
      const userRating = criterion.userRating;

      // Check if tool meets minimum requirement
      if (toolRating < userRating) {
        meetsAllCriteria = false;
      }

      // Calculate individual criterion score
      if (toolRating >= userRating) {
        // Tool meets or exceeds requirement
        // Base score of 8 points + bonus for exceeding (max 2 bonus points)
        const excess = Math.min(toolRating - userRating, 2);
        totalScore += 8 + excess;
      } else {
        // Tool falls short of requirement
        // Steeper penalty for not meeting requirements
        const shortfall = userRating - toolRating;
        totalScore += Math.max(0, 7 - shortfall * 2);
      }
    });

    // Calculate average score across all criteria
    let finalScore = totalScore / criteria.length;

    // Perfect score if tool meets or exceeds ALL criteria
    if (meetsAllCriteria) {
      finalScore = 10;
    }

    return finalScore;
  } catch (error) {
    console.warn('Error calculating tool score:', error);
    return 0;
  }
};

export const getTopPerformerStrengths = (tool: Tool, criteria: Criterion[]): string => {
  try {
    if (!tool) return 'N/A';

    const strengths = criteria
      .filter(c => {
        const rating = getToolRating(tool, c);
        return rating >= 4;
      })
      .map(c => c.name);
    
    return strengths.length > 0 ? strengths.join(', ') : 'N/A';
  } catch (error) {
    console.warn('Error getting top performer strengths:', error);
    return 'N/A';
  }
};

export const addPageNumbers = (pdf: jsPDF) => {
  try {
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        180,
        287
      );
    }
  } catch (error) {
    console.warn('Error adding page numbers:', error);
  }
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const validatePDFInput = (tools: Tool[], criteria: Criterion[]) => {
  if (!Array.isArray(tools) || !Array.isArray(criteria)) {
    throw new Error('Invalid tools or criteria array');
  }
  if (tools.length === 0 || criteria.length === 0) {
    throw new Error('At least one tool and criterion required');
  }
  
  // Validate tool structure
  tools.forEach((tool, index) => {
    if (!tool || typeof tool !== 'object') {
      throw new Error(`Invalid tool at index ${index}`);
    }
    if (!tool.id || !tool.name) {
      throw new Error(`Tool at index ${index} missing required fields`);
    }
  });

  // Validate criteria structure
  criteria.forEach((criterion, index) => {
    if (!criterion || typeof criterion !== 'object') {
      throw new Error(`Invalid criterion at index ${index}`);
    }
    if (!criterion.id || !criterion.name) {
      throw new Error(`Criterion at index ${index} missing required fields`);
    }
    if (typeof criterion.userRating !== 'number' || criterion.userRating < 1 || criterion.userRating > 5) {
      throw new Error(`Invalid user rating for criterion at index ${index}`);
    }
  });
};

// Helper function to get tool tags by type
export const getToolTagsByType = (tool: Tool, type: string): string[] => {
  try {
    if (!tool || !Array.isArray(tool.tags)) return [];
    
    return tool.tags
      .filter(tag => tag && typeof tag === 'object' && tag.type === type)
      .map(tag => tag.name)
      .filter(Boolean);
  } catch (error) {
    console.warn(`Error getting ${type} tags:`, error);
    return [];
  }
};

// Helper function to get tool methodologies
export const getToolMethodologies = (tool: Tool): string[] => {
  // First try direct methodologies array
  if (Array.isArray(tool.methodologies)) {
    return tool.methodologies;
  }
  return getToolTagsByType(tool, 'Methodology');
};

// Helper function to get tool functions
export const getToolFunctions = (tool: Tool): string[] => {
  // First try direct functions array
  if (Array.isArray(tool.functions)) {
    return tool.functions;
  }
  return getToolTagsByType(tool, 'Function');
};

// Helper function to get tool description
export const getToolDescription = (tool: Tool, criterionId: string): string => {
  try {
    if (Array.isArray(tool.criteria)) {
      const criterionData = tool.criteria.find(c => 
        c && typeof c === 'object' && 
        (c.id === criterionId || c.name === criterionId)
      );
      if (criterionData && typeof criterionData.description === 'string') {
        return criterionData.description;
      }
    }

    if (tool.ratingExplanations && typeof tool.ratingExplanations[criterionId] === 'string') {
      return tool.ratingExplanations[criterionId];
    }

    return '';
  } catch (error) {
    console.warn(`Error getting description for criterion ${criterionId}:`, error);
    return '';
  }
};

// Debug helper to log tool data
export const debugLogTool = (tool: Tool) => {
  try {
    console.log('Tool Debug Info:', {
      name: tool.name,
      id: tool.id,
      hasRatings: !!tool.ratings,
      hasCriteria: Array.isArray(tool.criteria),
      criteriaCount: Array.isArray(tool.criteria) ? tool.criteria.length : 0,
      sampleRating: tool.ratings?.scalability || tool.ratings?.['Scalability'] || 'N/A'
    });
  } catch (error) {
    console.warn('Error logging tool debug info:', error);
  }
};