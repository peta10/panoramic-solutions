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
          max_tokens: 500,
          temperature: 0.7,
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

    const toolsData = top3.map(tool => {
      const totalScore = Object.entries(criteriaWeights).reduce((sum, [criterion, weight]) => {
        const rating = tool.ratings[criterion as keyof typeof tool.ratings] || 0;
        return sum + (rating * weight);
      }, 0);
      
      const percentage = Math.round(totalScore);
      
      return {
        name: tool.name,
        score: percentage,
        strengths: this.getToolStrengths(tool, criteriaWeights)
      };
    });

    return `
Analyze these PPM tool evaluation results and provide a natural, insightful summary:

TOP 3 TOOLS:
${toolsData.map(tool => `• ${tool.name}: ${tool.score}% (Strong in: ${tool.strengths.join(', ')})`).join('\n')}

USER'S TOP PRIORITIES:
${sortedCriteria.map(([criterion, weight]) => `• ${criterion}: ${Math.round(weight * 100)}% importance`).join('\n')}

Please provide a 2-3 sentence analysis summary that:
1. Highlights the competitive landscape (close scores, clear winner, etc.)
2. Explains why these tools ranked highly based on the user's priorities
3. Mentions key differentiators between the top tools
4. Uses natural, conversational language that sounds like a consultant's insight

Format your response as:
SUMMARY: [2-3 sentences of natural analysis]
KEY_INSIGHT_1: [One specific insight]
KEY_INSIGHT_2: [Another specific insight]
RECOMMENDATION: [One sentence recommendation]

Avoid robotic phrases like "excels in" or "stands out in" - use more natural language.
`;
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
      .slice(0, 2)
      .map(item => item.criterion);
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
