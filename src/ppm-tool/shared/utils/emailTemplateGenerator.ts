import { Tool, Criterion } from '../types';
import { getToolRating, calculateScore, roundMatchScore } from './toolRating';
import { AIAnalysisService } from '../services/aiAnalysisService';

interface EmailTemplateData {
  userEmail: string;
  selectedTools: Tool[];
  selectedCriteria: Criterion[];
  chartImageUrl?: string;
  logoUrl?: string;
  mattHeadshotUrl?: string;
  bookingLink?: string;
  unsubscribeLink?: string;
  preferencesLink?: string;
}

interface WeightedScore {
  tool: Tool;
  weightedScore: number;
  criteriaScores: Record<string, number>;
  overallScore: number;
}

export class PPMEmailTemplateGenerator {
  private static readonly DEFAULT_LOGO = 'https://panoramicsolutions.com/images/Logo_Panoramic_Solutions.webp';
  private static readonly DEFAULT_BOOKING_LINK = 'https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt';
  private static readonly DEFAULT_MATT_HEADSHOT = 'https://panoramicsolutions.com/images/Wagner_Headshot_2024.webp';

  /**
   * Calculate weighted scores for tools based on user criteria preferences
   */
  private static calculateWeightedScores(
    tools: Tool[],
    criteria: Criterion[]
  ): WeightedScore[] {
    return tools.map(tool => {
      // Use the same scoring algorithm as the main app
      const overallScore = calculateScore(tool, criteria);
      const criteriaScores: Record<string, number> = {};

      // Get individual criterion scores
      criteria.forEach(criterion => {
        criteriaScores[criterion.id] = getToolRating(tool, criterion);
      });

      return {
        tool,
        weightedScore: overallScore,
        criteriaScores,
        overallScore: roundMatchScore(overallScore)
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }

  /**
   * Generate AI-powered insights text based on top 3 tools
   */
  private static async generateInsights(topTools: WeightedScore[], criteria: Criterion[], userEmail?: string): Promise<string> {
    if (topTools.length < 1) {
      return "Based on your criteria, these tools offer the best fit for your organization.";
    }

    try {
      // Prepare data for AI analysis
      const criteriaWeights: Record<string, number> = {};
      criteria.forEach(criterion => {
        criteriaWeights[criterion.name] = criterion.userRating / 5; // Convert 1-5 rating to decimal
      });

      const analysisData = {
        topTools: topTools.map(wt => wt.tool),
        criteriaWeights,
        userEmail
      };

      const analysis = await AIAnalysisService.generateAnalysis(analysisData);
      return analysis.summary;
    } catch (error) {
      console.error('AI Analysis failed, using fallback:', error);
      return this.generateBasicInsights(topTools, criteria);
    }
  }

  /**
   * Fallback method for generating basic insights (original logic)
   */
  private static generateBasicInsights(topTools: WeightedScore[], criteria: Criterion[]): string {
    if (topTools.length < 2) {
      return "Based on your criteria, these tools offer the best fit for your organization.";
    }

    const tool1 = topTools[0]?.tool.name;
    const tool2 = topTools[1]?.tool.name;
    const tool3 = topTools[2]?.tool.name;

    // Find strongest criteria for top tools
    const getStrongestCriteria = (toolScores: Record<string, number>, count: number = 2) => {
      return Object.entries(toolScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, count)
        .map(([criterionId]) => {
          const criterion = criteria.find(c => c.id === criterionId);
          return criterion?.name || criterionId;
        });
    };

    const tool1Strengths = getStrongestCriteria(topTools[0].criteriaScores);
    const tool2Strengths = getStrongestCriteria(topTools[1].criteriaScores);

    if (topTools.length >= 3 && tool3) {
      return `Based on your inputs, **${tool1} ranked strongest for ${tool1Strengths.join(' and ').toLowerCase()}**, while **${tool2} excelled at ${tool2Strengths.join(' and ').toLowerCase()}**. **${tool3} remains highly competitive** across multiple criteria, making it a strong option for leaders who need balanced capabilities. Together, these insights reveal the trade-offs between specialized excellence and well-rounded performance.`;
    } else {
      return `Based on your inputs, **${tool1} ranked strongest for ${tool1Strengths.join(' and ').toLowerCase()}**, while **${tool2} excelled at ${tool2Strengths.join(' and ').toLowerCase()}**. These results highlight the key trade-offs between specialized excellence and well-rounded performance for your specific needs.`;
    }
  }

  /**
   * Generate honorable mentions list
   */
  private static generateHonorableMentions(
    allScoredTools: WeightedScore[],
    topThree: WeightedScore[]
  ): string {
    const honorableMentions = allScoredTools
      .slice(3, 6) // Get tools ranked 4-6
      .filter(scored => scored.weightedScore >= 4.0); // Only include reasonably good tools

    if (honorableMentions.length === 0) {
      return '<li><strong>No additional tools</strong> met the threshold for honorable mention based on your criteria.</li>';
    }

    return honorableMentions.map(scored => {
      const strength = this.getToolMainStrength(scored);
      return `<li><strong>${scored.tool.name}</strong> – ${strength}</li>`;
    }).join('');
  }

  /**
   * Get main strength description for a tool
   */
  private static getToolMainStrength(scoredTool: WeightedScore): string {
    const toolName = scoredTool.tool.name;
    
    // Define known strengths for popular tools
    const toolStrengths: Record<string, string> = {
      'Jira': 'standout Agile capabilities at scale',
      'Asana': 'very strong in ease of use, lighter for portfolio governance',
      'Azure DevOps': 'tight integration with development workflows',
      'ClickUp': 'versatile feature set with strong customization',
      'Planview': 'enterprise portfolio governance and resource management',
      'Smartsheet': 'spreadsheet-like interface with powerful automation',
      'Monday.com': 'intuitive interface and team collaboration features',
      'Airtable': 'flexible database approach with excellent usability',
      'MS Project': 'comprehensive project management with Microsoft integration',
      'Adobe Workfront': 'creative workflow optimization and portfolio management',
      'Hive': 'modern interface with good collaboration features'
    };

    return toolStrengths[toolName] || `competitive performance across multiple criteria (${scoredTool.overallScore}/10 overall)`;
  }

  /**
   * Get top criteria names for display
   */
  private static getTopCriteriaForDisplay(criteria: Criterion[]): string[] {
    return criteria
      .sort((a, b) => (b.userRating || 3) - (a.userRating || 3))
      .slice(0, 3)
      .map(c => c.name);
  }

  /**
   * Generate individual radar chart images for top 3 tools
   */
  private static async generateRadarCharts(
    topThreeTools: WeightedScore[],
    selectedCriteria: Criterion[]
  ): Promise<{ toolName: string; chartImageUrl: string | null }[]> {
    const charts = [];
    
    for (let i = 0; i < topThreeTools.length; i++) {
      const { tool } = topThreeTools[i];
      
      try {
        // Use full URL for server-side requests
        const baseUrl = typeof window !== 'undefined' 
          ? '' // Client-side: use relative URL
          : process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : 'http://localhost:3000'; // Server-side: use full URL

        // Use canvas charts for Gmail compatibility (PNG format)
        const chartParams = new URLSearchParams({
          tool: tool.name,
          toolData: encodeURIComponent(JSON.stringify(tool)),
          criteria: selectedCriteria.map((c: any) => c.id).join(','),
          userRankings: selectedCriteria.map(() => '3').join(','), // Default user rating
          toolIndex: i.toString()
        });
        
        const imageUrl = `${baseUrl}/api/chart/dynamic.png?${chartParams.toString()}`;
        console.log(`📊 PPM Generator: Using canvas chart for ${tool.name}: ${imageUrl}`);
        charts.push({ toolName: tool.name, chartImageUrl: imageUrl });
      } catch (error) {
        console.warn(`Error generating radar chart for ${tool.name}:`, error);
        charts.push({ toolName: tool.name, chartImageUrl: null });
      }
    }
    
    return charts;
  }

  /**
   * Generate radar charts section HTML
   */
  private static generateRadarChartsHTML(
    radarCharts: { toolName: string; chartImageUrl: string | null }[]
  ): string {
    if (radarCharts.length === 0) return '';
    
    const chartsHTML = radarCharts.map(chart => `
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: bold;">
          ${chart.toolName}
        </h4>
        ${chart.chartImageUrl ? `
          <img src="${chart.chartImageUrl}" alt="${chart.toolName} Comparison Chart" 
               style="max-width: 100%; height: auto; border-radius: 6px;" />
          <div style="margin-top: 10px;">
            <span style="color: #10b981; font-size: 12px;">● Your Rankings</span>
            <span style="color: #2563eb; font-size: 12px; margin-left: 15px;">● ${chart.toolName} Rankings</span>
          </div>
        ` : `
          <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; border: 2px dashed #e2e8f0;">
            <p style="margin: 0; color: #9ca3af; font-size: 14px; font-style: italic;">
              📊 Chart visualization available in your full report
            </p>
          </div>
        `}
      </div>
    `).join('');
    
    return `
      <!-- Radar Charts Section -->
      <tr>
        <td style="padding: 0 30px 25px;" class="mobile-padding">
          <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 20px; font-weight: bold;" class="mobile-text">
            Your Rankings vs Tool Rankings
          </h3>


          <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 15px; line-height: 22px;" class="mobile-small">
            These results combine <strong>your ranked criteria</strong> with our <strong>independent research and real-world 
            implementation experience</strong>, helping you set a foundation for <strong>lasting project portfolio success</strong>.
          </p>
          
          ${chartsHTML}
        </td>
      </tr>
    `;
  }

  /**
   * Generate the complete HTML email template
   */
  public static async generateHTMLEmail(data: EmailTemplateData): Promise<string> {
    const {
      selectedTools,
      selectedCriteria,
      chartImageUrl,
      logoUrl = this.DEFAULT_LOGO,
      mattHeadshotUrl = this.DEFAULT_MATT_HEADSHOT,
      bookingLink = this.DEFAULT_BOOKING_LINK,
      unsubscribeLink = '#',
      preferencesLink = '#'
    } = data;

    // Calculate weighted scores and get top 3
    const scoredTools = this.calculateWeightedScores(selectedTools, selectedCriteria);
    const topThree = scoredTools.slice(0, 3);

    // Generate radar charts for top 3 tools
    const radarCharts = await this.generateRadarCharts(topThree, selectedCriteria);

    // Generate dynamic content
    const criteriaList = selectedCriteria.map(c => c.name).join(', ');
    const topCriteria = this.getTopCriteriaForDisplay(selectedCriteria);
    const insights = await this.generateInsights(topThree, selectedCriteria, data.userEmail);
    const honorableMentions = this.generateHonorableMentions(scoredTools, topThree);
    const radarChartsHTML = this.generateRadarChartsHTML(radarCharts);

    // Get our base template
    const template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Your PPM Tool Comparison Report</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset & Base Styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        /* Remove default styling */
        img { border: 0; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        
        /* Mobile Styles */
        @media screen and (max-width: 640px) {
            .mobile-full { width: 100% !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-text { font-size: 16px !important; line-height: 24px !important; }
            .mobile-small { font-size: 14px !important; line-height: 20px !important; }
            .mobile-center { text-align: center !important; }
            .hide-mobile { display: none !important; }
            .chart-container { width: 100% !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f9fc; font-family: Arial, sans-serif;">
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
        <tr>
            <td style="padding: 20px 0;">
                
                <!-- Main Email Table -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" class="mobile-full">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0057B7 0%, #2E8B57 100%); padding: 30px; border-radius: 8px 8px 0 0;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <!-- Logo -->
                                        <img src="${logoUrl}" alt="Panoramic Solutions" style="height: 40px; margin-bottom: 20px;" />
                                        
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; line-height: 34px;" class="mobile-text">
                                            ✅ Your Personalized PPM Tool Comparison Report
                                        </h1>
                                        
                                        <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 16px; line-height: 24px; opacity: 0.9;" class="mobile-small">
                                            Here's how the leading tools stack up—based on your ranked criteria and our research-backed evaluation.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Criteria Context -->
                    <tr>
                        <td style="padding: 25px 30px 20px;" class="mobile-padding">
                            <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 22px;" class="mobile-small">
                                Because you ranked your priorities using our guided method across <strong>${criteriaList}</strong>, the results below map directly to what matters most for your organization.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Top 3 Recommendations Header -->
                    <tr>
                        <td style="padding: 0 30px;" class="mobile-padding">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 24px; font-weight: bold; border-bottom: 3px solid #0057B7; padding-bottom: 10px;" class="mobile-text">
                                Top 3 Tools for your Project Portfolio Management Use Case
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Top 3 Tools Table -->
                    <tr>
                        <td style="padding: 0 30px 25px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                                <!-- Table Header -->
                                <tr style="background-color: #f7fafc;">
                                    <td style="padding: 15px; font-weight: bold; color: #2d3748; font-size: 14px; border-right: 1px solid #e2e8f0;">
                                        Tool
                                    </td>
                                    <td style="padding: 15px; font-weight: bold; color: #2d3748; font-size: 14px; border-right: 1px solid #e2e8f0; text-align: center;" class="hide-mobile">
                                        ${topCriteria[0] || 'Criterion 1'}
                                    </td>
                                    <td style="padding: 15px; font-weight: bold; color: #2d3748; font-size: 14px; border-right: 1px solid #e2e8f0; text-align: center;" class="hide-mobile">
                                        ${topCriteria[1] || 'Criterion 2'}
                                    </td>
                                    <td style="padding: 15px; font-weight: bold; color: #2d3748; font-size: 14px; border-right: 1px solid #e2e8f0; text-align: center;" class="hide-mobile">
                                        ${topCriteria[2] || 'Criterion 3'}
                                    </td>
                                    <td style="padding: 15px; font-weight: bold; color: #2d3748; font-size: 14px; text-align: center;">
                                        Overall
                                    </td>
                                </tr>
                                
                                ${topThree.map((scored, index) => {
                                  const tool = scored.tool;
                                  const topCriteriaObjects = topCriteria.map(name => 
                                    selectedCriteria.find(c => c.name === name)
                                  ).filter(Boolean) as Criterion[];
                                  
                                  const criterion1Score = topCriteriaObjects[0] ? getToolRating(tool, topCriteriaObjects[0]) : 0;
                                  const criterion2Score = topCriteriaObjects[1] ? getToolRating(tool, topCriteriaObjects[1]) : 0;
                                  const criterion3Score = topCriteriaObjects[2] ? getToolRating(tool, topCriteriaObjects[2]) : 0;
                                  
                                  return `
                                <!-- Tool ${index + 1} -->
                                <tr${index < 2 ? ' style="border-bottom: 1px solid #e2e8f0;"' : ''}>
                                    <td style="padding: 15px; font-weight: bold; color: #0057B7; font-size: 16px; border-right: 1px solid #e2e8f0;">
                                        ${tool.name}
                                    </td>
                                    <td style="padding: 15px; font-size: 16px; text-align: center; border-right: 1px solid #e2e8f0;" class="hide-mobile">
                                        <strong>${criterion1Score}/5</strong>
                                    </td>
                                    <td style="padding: 15px; font-size: 16px; text-align: center; border-right: 1px solid #e2e8f0;" class="hide-mobile">
                                        <strong>${criterion2Score}/5</strong>
                                    </td>
                                    <td style="padding: 15px; font-size: 16px; text-align: center; border-right: 1px solid #e2e8f0;" class="hide-mobile">
                                        <strong>${criterion3Score}/5</strong>
                                    </td>
                                    <td style="padding: 15px; font-size: 18px; font-weight: bold; color: #0057B7; text-align: center;">
                                        ${scored.overallScore}/10
                                    </td>
                                </tr>`;
                                }).join('')}
                            </table>
                            
                            <p style="margin: 15px 0 0 0; color: #718096; font-size: 14px; font-style: italic;" class="mobile-small">
                                *These are the three best-fit tools based on your weighted priorities.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Key Insights -->
                    <tr>
                        <td style="padding: 0 30px 25px;" class="mobile-padding">
                            <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 24px; font-weight: bold;" class="mobile-text">
                                Analysis Summary
                            </h3>
                            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #0057B7;">
                                <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 24px;" class="mobile-small">
                                    ${insights}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Honorable Mentions -->
                    <tr>
                        <td style="padding: 0 30px 25px;" class="mobile-padding">
                            <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 20px; font-weight: bold;" class="mobile-text">
                                Honorable Mentions:
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 15px; line-height: 24px;" class="mobile-small">
                                ${honorableMentions}
                            </ul>
                        </td>
                    </tr>
                    
                    ${radarChartsHTML}
                    
                    <!-- Value Proposition -->
                    <tr>
                        <td style="padding: 0 30px 25px;" class="mobile-padding">
                            <div style="background-color: #edf2f7; padding: 25px; border-radius: 8px; text-align: center;">
                                <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 24px;" class="mobile-small">
                                    These results combine <strong>your ranked criteria</strong> with our <strong>independent research and real-world implementation experience</strong>, giving you a clear foundation to build your business case while avoiding costly trial-and-error.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Section -->
                    <tr>
                        <td style="padding: 0 30px 40px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 20px; font-weight: bold;" class="mobile-text">
                                            👉 Ready to Move Forward?
                                        </h3>
                                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 15px; line-height: 22px;" class="mobile-small">
                                            We'll walk through your results and map the fastest path to adoption success.
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="background-color: #2E8B57; border-radius: 6px; text-align: center;">
                                                    <a href="${bookingLink}" style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;" class="mobile-text">
                                                        📅 Book My Strategy Call
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Signature -->
                    <tr>
                        <td style="padding: 30px; background-color: #f7fafc; border-radius: 0 0 8px 8px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 15px; line-height: 22px;" class="mobile-small">
                                            Talk soon,
                                        </p>
                                        <p style="margin: 0; color: #2d3748; font-size: 16px; font-weight: bold;" class="mobile-text">
                                            <strong>Matt Wagner</strong><br>
                                            <span style="font-weight: normal; color: #4a5568;">Founder, Panoramic Solutions</span>
                                        </p>
                                    </td>
                                    <td style="text-align: right; width: 80px;" class="hide-mobile">
                                        <img src="${mattHeadshotUrl}" alt="Matt Wagner" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #e2e8f0;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 20px auto 0;" class="mobile-full">
                    <tr>
                        <td style="padding: 20px 30px; text-align: center;" class="mobile-padding">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; line-height: 18px;" class="mobile-small">
                                © 2024 Panoramic Solutions. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #718096; font-size: 12px; line-height: 16px;" class="mobile-small">
                                You received this email because you requested a PPM tool comparison report from PanoramicSolutions.com<br>
                                <a href="${unsubscribeLink}" style="color: #0057B7; text-decoration: underline;">Unsubscribe</a> | 
                                <a href="${preferencesLink}" style="color: #0057B7; text-decoration: underline;">Email Preferences</a>
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>`;

    return template;
  }

  /**
   * Generate plain text version for email clients that don't support HTML
   */
  public static async generatePlainTextEmail(data: EmailTemplateData): Promise<string> {
    const { selectedTools, selectedCriteria } = data;
    
    // Calculate weighted scores and get top 3
    const scoredTools = this.calculateWeightedScores(selectedTools, selectedCriteria);
    const topThree = scoredTools.slice(0, 3);

    const criteriaList = selectedCriteria.map(c => c.name).join(', ');
    const rawInsights = await this.generateInsights(topThree, selectedCriteria, data.userEmail);
    const insights = rawInsights
      .replace(/\*\*/g, '')
      .replace(/<[^>]*>/g, '');

    return `
YOUR PPM TOOL COMPARISON REPORT
================================

Hi there!

Here's how the leading PPM tools stack up based on your ranked criteria and our research-backed evaluation.

CRITERIA ANALYZED: ${criteriaList}

TOP 3 RECOMMENDATIONS:
======================

1. ${topThree[0]?.tool.name || 'N/A'} - Overall Score: ${topThree[0]?.overallScore || 'N/A'}/10
2. ${topThree[1]?.tool.name || 'N/A'} - Overall Score: ${topThree[1]?.overallScore || 'N/A'}/10
3. ${topThree[2]?.tool.name || 'N/A'} - Overall Score: ${topThree[2]?.overallScore || 'N/A'}/10

*These are the three best-fit tools based on your weighted priorities.

KEY INSIGHTS:
=============
${insights}

These results combine your ranked criteria with our independent research and real-world implementation experience, giving you a clear foundation to build your business case while avoiding costly trial-and-error.

READY TO MOVE FORWARD?
======================
We'll walk through your results and map the fastest path to adoption success.

Book your strategy call: ${data.bookingLink || this.DEFAULT_BOOKING_LINK}

Talk soon,
Matt Wagner
Founder, Panoramic Solutions

---
© 2024 Panoramic Solutions. All rights reserved.
You received this email because you requested a PPM tool comparison report from PanoramicSolutions.com

To unsubscribe: ${data.unsubscribeLink || '#'}
`;
  }

  /**
   * Generate Resend-compatible email payload
   */
  public static async generateResendPayload(data: EmailTemplateData, testMode = false): Promise<{
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    tags: Array<{ name: string; value: string }>;
  }> {
    // In test mode, use a simple template to isolate delivery issues
    if (testMode) {
      const simpleHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #0057B7;">PPM Tool Report Test</h1>
            <p>This is a test email from your PPM Tool comparison system.</p>
            <p><strong>Tools analyzed:</strong> ${data.selectedTools.length}</p>
            <p><strong>Criteria used:</strong> ${data.selectedCriteria.length}</p>
            <p>If you received this email, the system is working correctly!</p>
            <hr>
            <p><em>Matt Wagner, PMP<br>Panoramic Solutions</em></p>
          </body>
        </html>
      `;
      
      const simpleText = `
PPM Tool Report Test

This is a test email from your PPM Tool comparison system.
Tools analyzed: ${data.selectedTools.length}
Criteria used: ${data.selectedCriteria.length}

If you received this email, the system is working correctly!

Matt Wagner, PMP
Panoramic Solutions
      `.trim();

      return {
        from: 'Matt Wagner <matt.wagner@panoramic-solutions.com>',
        to: data.userEmail,
        subject: '[TEST] PPM Tool Comparison System',
        html: simpleHtml,
        text: simpleText,
        tags: [
          { name: 'category', value: 'ppm-tool-test' },
          { name: 'source', value: 'comparison-tool-test' }
        ]
      };
    }

    const topTool = this.calculateWeightedScores(data.selectedTools, data.selectedCriteria)[0];
    const subjectLine = topTool ? 
      `Your PPM Tool Report: ${topTool.tool.name} Leads Your Analysis` :
      'Your PPM Tool Comparison Report (See Results Below)';

    return {
      from: 'Matt Wagner <matt.wagner@panoramic-solutions.com>',
      to: data.userEmail,
      subject: subjectLine,
      html: await this.generateHTMLEmail(data),
      text: await this.generatePlainTextEmail(data),
      tags: [
        { name: 'category', value: 'ppm-tool-report' },
        { name: 'source', value: 'comparison-tool' },
        { name: 'tool_count', value: data.selectedTools.length.toString() },
        { name: 'criteria_count', value: data.selectedCriteria.length.toString() }
      ]
    };
  }
}
