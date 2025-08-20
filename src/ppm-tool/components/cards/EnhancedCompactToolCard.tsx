import React from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react';
import { Tool, Criterion } from '@/ppm-tool/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/ppm-tool/components/ui/card';
import { Button } from '@/ppm-tool/components/ui/button';
import { Progress } from '@/ppm-tool/components/ui/progress';
import { cn } from '@/ppm-tool/shared/lib/utils';
import { roundMatchScore } from '@/ppm-tool/shared/utils/toolRating';
import { MethodologyTags } from '@/ppm-tool/components/common/MethodologyTags';

interface EnhancedCompactToolCardProps {
  tool: Tool;
  selectedCriteria: Criterion[];
  matchScore: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCompare?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isCompared?: boolean;
}

// Helper function to get tool rating for a criterion
const getToolRating = (tool: Tool, criterion: Criterion): number => {
  try {
    if (Array.isArray(tool.criteria)) {
      const criterionDataById = tool.criteria.find(c => c.id === criterion.id);
      if (criterionDataById && typeof criterionDataById.ranking === 'number') {
        return criterionDataById.ranking;
      }
      const criterionDataByName = tool.criteria.find(c => c.name === criterion.name);
      if (criterionDataByName && typeof criterionDataByName.ranking === 'number') {
        return criterionDataByName.ranking;
      }
    }
    return 0;
  } catch (error) {
    console.error(`Error getting rating for criterion ${criterion.name}:`, error);
    return 0;
  }
};

// Helper function to get tool explanation for a criterion
const getToolExplanation = (tool: Tool, criterion: Criterion): string => {
  try {
    if (Array.isArray(tool.criteria)) {
      const criterionData = tool.criteria.find(c => 
        c.id === criterion.id || c.name === criterion.name
      );
      if (criterionData && typeof criterionData.description === 'string') {
        return criterionData.description;
      }
    }

    if (tool.ratingExplanations && typeof tool.ratingExplanations[criterion.id] === 'string') {
      return tool.ratingExplanations[criterion.id];
    }

    return '';
  } catch (error) {
    console.warn(`Error getting explanation for criterion ${criterion.name}:`, error);
    return '';
  }
};

// Helper function to get match score display - with proper color coding
const getMatchScoreDisplay = (score: number): { value: string; color: string; variant: "default" | "secondary" | "destructive"; bgColor: string } => {
  const roundedScore = roundMatchScore(score);
  
  if (roundedScore >= 8) {
    return { 
      value: `${roundedScore}/10`, 
      color: 'text-green-700', 
      variant: 'secondary',
      bgColor: 'bg-green-50 border-green-200'
    };
  } else if (roundedScore >= 6) {
    return { 
      value: `${roundedScore}/10`, 
      color: 'text-alpine-blue-700', 
      variant: 'secondary',
      bgColor: 'bg-alpine-blue-50 border-alpine-blue-200'
    };
  } else {
    return { 
      value: `${roundedScore}/10`, 
      color: 'text-gray-700', 
      variant: 'secondary',
      bgColor: 'bg-gray-50 border-gray-200'
    };
  }
};

// Trial URLs for tools with free trials
const getTrialUrl = (toolName: string) => {
  const trialUrls: Record<string, string> = {
    'Smartsheet': 'https://www.smartsheet.com/try-it?srsltid=AfmBOor4RqT116TFY_48lksZ95POoe3B_Yh4UG0yOSkM36A8sDl_p8SD',
    'Airtable': 'https://airtable.com/signup?_gl=1*7li2z1*_gcl_au*MjQzMjA4MDQxLjE3NTQwODU1OTU.*_ga*MTQ1MzI0NTk3LjE3NTQwODU1OTU.*_ga_VJY8J9RFZM*czE3NTQwODU1OTQkbzEkZzEkdDE3NTQwODU4NTMkajM2JGwwJGgw',
    'Asana': 'https://asana.com/pricing#signup',
    'Monday.com': 'https://auth.monday.com/users/sign_up_new?origin=hp_fullbg_page_header',
    'Jira': 'https://www.atlassian.com/try/cloud/signup?bundle=jira-software&edition=free&skipBundles=true',
    'ClickUp': 'https://clickup.com/lp?utm_source=google&utm_medium=cpc&utm_campaign=gs_cpc_arlv_nnc_brand_trial_all-devices_troas_lp_x_all-departments_x_brand&utm_content=all-countries_kw-target_text_all-industries_all-features_all-use-cases_clickup_trial_broad&utm_term=clickup%20trial&utm_creative=651395804801_BrandChampion-03072023_rsa&utm_custom1=&utm_custom2=&utm_lptheme=&utm_lpmod=&utm_mt=b&gad_source=1&gad_campaignid=19826757985&gbraid=0AAAAACR5vIL4cH-uF4FtwbdbBQWPZclm0&gclid=EAIaIQobChMIkM-Gy8_qjgMVg5xaBR2cQQpKEAAYASAAEgLudPD_BwE',
    'Azure DevOps': 'https://go.microsoft.com/fwlink/?linkid=2227353&clcid=0x40a&l=es-es',
    'Planview': 'https://www.planview.com/products-solutions/products/projectplace/enterprise-trial/'
  };
  return trialUrls[toolName];
};

// Check if tool has free trial
const hasFreeTrial = (toolName: string) => {
  return getTrialUrl(toolName) !== undefined;
};

export const EnhancedCompactToolCard: React.FC<EnhancedCompactToolCardProps> = ({
  tool,
  selectedCriteria,
  matchScore,
  isExpanded,
  onToggleExpand,
  onCompare,
  isCompared = false
}) => {
  const matchDisplay = getMatchScoreDisplay(matchScore);

  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg border-2 hover:border-alpine-blue-200 cursor-pointer !bg-white"
      onClick={onToggleExpand}
    >
      <CardHeader className="pb-2 md:pb-3 px-4 md:px-6 pt-4 md:pt-6">
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-1">
              <CardTitle className="text-base md:text-lg text-gray-900 break-words">{tool.name}</CardTitle>
              <div className={`inline-flex items-center px-2 py-1 rounded-lg ${matchDisplay.bgColor} flex-shrink-0`}>
                <span className={`text-xs md:text-sm font-bold ${matchDisplay.color}`}>{matchDisplay.value}</span>
                <span className="text-xs ml-1 text-gray-600">Match Score</span>
              </div>
            </div>
            <MethodologyTags tool={tool} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 md:gap-1.5" onClick={(e) => e.stopPropagation()}>
            {hasFreeTrial(tool.name) && (
              <Button size="sm" variant="secondary" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 w-full sm:w-auto" asChild>
                <a 
                  href={getTrialUrl(tool.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 justify-center"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden sm:inline">Try Free</span>
                  <span className="sm:hidden">Try</span>
                </a>
              </Button>
            )}
            <Button 
              size="sm" 
              variant="secondary" 
              className={cn(
                "h-7 md:h-8 px-2 md:px-3 text-xs w-full sm:w-auto",
                isCompared 
                  ? "bg-alpine-blue-100 text-alpine-blue-700 hover:bg-alpine-blue-200" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
              onClick={onCompare}
            >
              <Star className={cn(
                "w-3 h-3 mr-1",
                isCompared ? "fill-yellow-400 text-yellow-500" : "fill-yellow-400 text-yellow-500"
              )} />
              {isCompared ? 'Added' : 'Compare'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3 px-4 md:px-6 pb-4 md:pb-6">
        <div className="cursor-pointer -mx-4 md:-mx-6 px-4 md:px-6 py-2 md:py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-200 flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-alpine-blue-600">
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              View Details
            </>
          )}
        </div>
          
        {isExpanded && (
          <div className="mt-2 md:mt-3 space-y-2 md:space-y-3" onClick={(e) => e.stopPropagation()}>
            {selectedCriteria.map((criterion) => {
              const toolRating = getToolRating(tool, criterion);
              const userRating = criterion.userRating;
              const explanation = getToolExplanation(tool, criterion);
              const meetsRequirement = toolRating >= userRating;

              return (
                <div key={criterion.id} className={`p-2 md:p-3 rounded-lg border ${meetsRequirement ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <span className="font-medium text-xs md:text-sm text-gray-900">{criterion.name}</span>
                      <div className="text-xs text-gray-600 flex-shrink-0">
                        My Rankings: <span className="font-medium">{userRating}/5</span>
                        <span className="mx-1">•</span>
                        <span className="font-bold text-gray-900">Tool Rankings:</span> <span className={meetsRequirement ? "text-green-600 font-medium" : "text-gray-600 font-medium"}>{toolRating}/5</span>
                      </div>
                    </div>
                    <Progress value={(toolRating / 5) * 100} className={`h-1.5 ${meetsRequirement ? 'bg-green-100' : 'bg-gray-100'}`} />
                    {explanation && (
                      <div className="text-xs text-gray-700 bg-white/60 p-2 rounded">
                        {explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 