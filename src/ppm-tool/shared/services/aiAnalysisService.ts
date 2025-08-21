import { Tool, Criterion } from '../types';

interface AnalysisData {
  topTools: Tool[];
  criteriaWeights: Record<string, number>;
  userEmail?: string;
}

interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  recommendations: string;
}

export class AIAnalysisService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  
  static async generateAnalysis(data: AnalysisData): Promise<AnalysisResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback to basic analysis if no API key
      return this.generateBasicAnalysis(data);
    }

    try {
      const prompt = this.buildAnalysisPrompt(data);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a seasoned Project Portfolio Management consultant with 15+ years of experience helping organizations select the right PPM tools. Your writing style is professional yet conversational, insightful, and avoids jargon. You provide actionable insights that help decision-makers understand not just what the data shows, but why it matters for their organization.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 600,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return this.parseAnalysisResponse(content);
    } catch (error) {
      console.error('AI Analysis failed, using fallback:', error);
      return this.generateBasicAnalysis(data);
    }
  }

  private static buildAnalysisPrompt(data: AnalysisData): string {
    const { topTools, criteriaWeights } = data;
    
    // Get top 3 tools with their scores
    const top3 = topTools.slice(0, 3);
    
    // Find the most important criteria (highest weights)
    const sortedCriteria = Object.entries(criteriaWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const toolsData = top3.map((tool, index) => {
      const totalScore = Object.entries(criteriaWeights).reduce((sum, [criterion, weight]) => {
        const rating = tool.ratings[criterion as keyof typeof tool.ratings] || 0;
        return sum + (rating * weight);
      }, 0);
      
      const percentage = Math.round(totalScore);
      
      // Get unique strengths for each tool to avoid overlap
      const allStrengths = this.getToolStrengths(tool, criteriaWeights);
      const uniqueStrengths = this.getUniqueStrengths(tool, allStrengths, index, top3, criteriaWeights);
      
      // Get actual insights for each strength
      const strengthInsights = uniqueStrengths.map(strength => {
        const explanation = this.getToolExplanation(tool, strength);
        return explanation ? `${strength}: ${explanation}` : strength;
      });
      
      return {
        name: tool.name,
        score: percentage,
        strengths: uniqueStrengths,
        strengthInsights,
        position: index + 1
      };
    });

    // Calculate score differences for competitive analysis
    const scoreDiff1to2 = top3.length > 1 ? toolsData[0].score - toolsData[1].score : 0;
    const scoreDiff2to3 = top3.length > 2 ? toolsData[1].score - toolsData[2].score : 0;

    return `
You are a senior PPM consultant analyzing tool evaluation results using ACTUAL tool insights from the database. Provide analysis based on real data, not assumptions.

EVALUATION RESULTS WITH ACTUAL INSIGHTS:
${toolsData.map(tool => {
  const basicInfo = `${tool.position}. ${tool.name}: ${tool.score}%`;
  const insights = tool.strengthInsights.length > 0 
    ? `\n   Real strengths: ${tool.strengthInsights.join(' | ')}`
    : `\n   Basic strengths: ${tool.strengths.join(', ')}`;
  return basicInfo + insights;
}).join('\n\n')}

COMPETITIVE LANDSCAPE:
- Score gap between #1 and #2: ${scoreDiff1to2} points
- Score gap between #2 and #3: ${scoreDiff2to3} points

USER'S KEY PRIORITIES (weighted by importance):
${sortedCriteria.map(([criterion, weight]) => `• ${criterion}: ${Math.round(weight * 100)}% weight`).join('\n')}

ANALYSIS REQUIREMENTS:
1. Use the ACTUAL tool insights provided above (not generic assumptions)
2. Explain WHY the ranking turned out this way based on user priorities
3. Highlight what makes each tool DIFFERENT using real differentiators
4. Comment on the competitive closeness/gaps between tools
5. Give specific insights about tool selection factors based on actual capabilities

CRITICAL: 
- Use the actual insights provided, not generic "strong in X" statements
- Each tool must have DIFFERENT differentiators based on real data
- Transform technical insights into business value

Format response as:
SUMMARY: [2-3 sentences explaining the ranking and competitive dynamics using actual insights]
KEY_INSIGHT_1: [Specific insight about the winner's advantage based on real data]
KEY_INSIGHT_2: [Specific insight about an important differentiator between tools using actual insights]
RECOMMENDATION: [Actionable guidance for tool selection based on real capabilities]

Use executive language. Be specific, not generic. Base everything on the actual insights provided.`;
  }

  private static getToolStrengths(tool: Tool, criteriaWeights: Record<string, number>): string[] {
    const toolScores = Object.entries(tool.ratings).map(([criterion, rating]) => ({
      criterion,
      rating,
      weight: criteriaWeights[criterion] || 0,
      weightedScore: rating * (criteriaWeights[criterion] || 0)
    }));

    return toolScores
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 3) // Get top 3 instead of 2 for more options
      .map(item => item.criterion);
  }

  private static getToolExplanation(tool: Tool, criterionName: string): string {
    try {
      // First try to find in criteria array
      if (Array.isArray(tool.criteria)) {
        const criterionData = tool.criteria.find(c => 
          c.name === criterionName || c.id === criterionName
        );
        if (criterionData && typeof criterionData.description === 'string') {
          return criterionData.description;
        }
      }

      // Then try ratingExplanations
      if (tool.ratingExplanations && typeof tool.ratingExplanations[criterionName] === 'string') {
        return tool.ratingExplanations[criterionName];
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  private static getUniqueStrengths(
    tool: Tool, 
    allStrengths: string[], 
    toolIndex: number, 
    allTools: Tool[], 
    criteriaWeights: Record<string, number>
  ): string[] {
    // Get already used strengths from previous tools
    const usedStrengths = new Set<string>();
    
    for (let i = 0; i < toolIndex; i++) {
      const prevToolStrengths = this.getToolStrengths(allTools[i], criteriaWeights);
      prevToolStrengths.forEach(strength => usedStrengths.add(strength));
    }

    // Find unique strengths for this tool
    const uniqueStrengths = allStrengths.filter(strength => !usedStrengths.has(strength));
    
    // If we have unique strengths, return up to 2
    if (uniqueStrengths.length > 0) {
      return uniqueStrengths.slice(0, 2);
    }
    
    // Fallback: return the tool's strongest areas even if not unique
    // But try to differentiate by focusing on secondary strengths
    const fallbackStrengths = allStrengths.slice(toolIndex, toolIndex + 2);
    return fallbackStrengths.length > 0 ? fallbackStrengths : allStrengths.slice(0, 1);
  }

  private static parseAnalysisResponse(content: string): AnalysisResult {
    const lines = content.split('\n').filter(line => line.trim());
    
    let summary = '';
    const keyInsights: string[] = [];
    let recommendations = '';

    for (const line of lines) {
      if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('KEY_INSIGHT_')) {
        keyInsights.push(line.replace(/KEY_INSIGHT_\d+:/, '').trim());
      } else if (line.startsWith('RECOMMENDATION:')) {
        recommendations = line.replace('RECOMMENDATION:', '').trim();
      }
    }

    return {
      summary: summary || content.split('\n')[0] || 'Analysis completed successfully.',
      keyInsights: keyInsights.length > 0 ? keyInsights : ['Detailed analysis available in full report.'],
      recommendations: recommendations || 'Consider your specific organizational needs when making the final decision.'
    };
  }

  private static generateBasicAnalysis(data: AnalysisData): AnalysisResult {
    const { topTools } = data;
    const top3 = topTools.slice(0, 3);
    
    if (top3.length === 0) {
      return {
        summary: 'No tools were evaluated in this analysis.',
        keyInsights: ['Please ensure tool ratings are provided for a comprehensive analysis.'],
        recommendations: 'Review your evaluation criteria and tool selection.'
      };
    }

    const scores = top3.map(tool => {
      const totalScore = Object.values(tool.ratings).reduce((sum, rating) => sum + rating, 0) / Object.keys(tool.ratings).length;
      return Math.round(totalScore * 20); // Convert to percentage
    });

    const leader = top3[0];
    const isCloseRace = scores.length > 1 && (scores[0] - scores[1]) <= 5;

    let summary = '';
    if (isCloseRace) {
      summary = `Your evaluation reveals a competitive landscape with ${leader.name} leading at ${scores[0]}%, followed closely by ${top3[1]?.name} at ${scores[1]}%. This tight competition suggests multiple viable options for your organization.`;
    } else {
      summary = `${leader.name} emerges as the clear frontrunner with a ${scores[0]}% fit score, significantly outperforming other options in your evaluation criteria.`;
    }

    return {
      summary,
      keyInsights: [
        `${leader.name} demonstrates the strongest overall alignment with your priorities.`,
        top3.length > 1 ? `Consider ${top3[1]?.name} as a strong alternative option.` : 'Single tool evaluation completed.'
      ],
      recommendations: 'Schedule demos with your top-ranked tools to validate these findings with hands-on experience.'
    };
  }
}
