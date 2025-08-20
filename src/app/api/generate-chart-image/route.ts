import { NextRequest, NextResponse } from 'next/server';
import { Tool, Criterion } from '@/ppm-tool/shared/types';

// Try to import canvas, fallback if not available
let createCanvas: any;
try {
  const canvasModule = require('canvas');
  createCanvas = canvasModule.createCanvas;
} catch (error) {
  console.warn('Canvas module not available, using fallback');
  createCanvas = null;
}

// Chart colors matching the frontend
const toolColors: [string, string][] = [
  ['rgba(220, 38, 38, 0.2)', 'rgba(220, 38, 38, 1)'],      // Red
  ['rgba(37, 99, 235, 0.2)', 'rgba(37, 99, 235, 1)'],      // Blue  
  ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 1)'],    // Emerald
  ['rgba(147, 51, 234, 0.2)', 'rgba(147, 51, 234, 1)'],    // Purple
  ['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 1)'],    // Pink
  ['rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 1)'],    // Teal
];

const getToolColor = (index: number): [string, string] => {
  return toolColors[index % toolColors.length];
};

// Helper function to get tool rating for a criterion
const getToolRating = (tool: Tool, criterion: Criterion): number => {
  try {
    // First try to find the criterion in the tool's criteria array by ID
    if (Array.isArray(tool.criteria)) {
      const criterionDataById = tool.criteria.find(c => c.id === criterion.id);
      if (criterionDataById && typeof criterionDataById.ranking === 'number') {
        return criterionDataById.ranking;
      }
      
      // Or by name
      const criterionDataByName = tool.criteria.find(c => c.name === criterion.name);
      if (criterionDataByName && typeof criterionDataByName.ranking === 'number') {
        return criterionDataByName.ranking;
      }
    }

    // Try to get rating from ratings object using criterion ID
    if (tool.ratings && typeof tool.ratings[criterion.id] === 'number') {
      return tool.ratings[criterion.id];
    }
    
    // Special case for specific criterion IDs in the rating object
    const criterionMappings: Record<string, string[]> = {
      'scalability': ['Scalability', 'scalability'],
      'integrations': ['Integrations & Extensibility', 'integrations', 'Integrations'],
      'easeOfUse': ['Ease of Use', 'easeOfUse', 'ease_of_use', 'ease-of-use'],
      'flexibility': ['Flexibility & Customization', 'flexibility', 'customization'],
      'ppmFeatures': ['Portfolio Management', 'ppmFeatures', 'ppm_features', 'ppm'],
      'reporting': ['Reporting & Analytics', 'reporting', 'analytics'],
      'security': ['Security & Compliance', 'security', 'compliance']
    };
    
    // Try all possible criterion keys
    const possibleKeys = criterionMappings[criterion.id] || [criterion.name, criterion.id];
    
    for (const key of possibleKeys) {
      if (tool.ratings && typeof tool.ratings[key] === 'number') {
        return tool.ratings[key];
      }
    }
    
    // Check the ratings object with case-insensitive keys
    if (tool.ratings) {
      const criterionNameLower = criterion.name.toLowerCase();
      const matchingKey = Object.keys(tool.ratings).find(key => 
        key.toLowerCase() === criterionNameLower || 
        key.toLowerCase() === criterion.id.toLowerCase()
      );
      
      if (matchingKey && typeof tool.ratings[matchingKey] === 'number') {
        return tool.ratings[matchingKey];
      }
    }

    return 0;
  } catch (error) {
    console.error(`Error getting rating for criterion ${criterion.name}:`, error);
    return 0;
  }
};

const createRadarChart = (
  tool: Tool,
  selectedCriteria: Criterion[],
  canvas: any,
  toolIndex: number = 0
) => {
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.6; // Reduced for better label spacing

  // Clear canvas with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw axis lines and labels
  const angleStep = (2 * Math.PI) / selectedCriteria.length;
  
  selectedCriteria.forEach((criterion, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    // Draw axis line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label with word wrapping
    ctx.fillStyle = '#374151';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const labelX = centerX + Math.cos(angle) * (radius + 25);
    const labelY = centerY + Math.sin(angle) * (radius + 25);
    
    // Wrap text if too long
    const words = criterion.name.split(' ');
    if (words.length > 1 && criterion.name.length > 12) {
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      ctx.fillText(line1, labelX, labelY - 6);
      ctx.fillText(line2, labelX, labelY + 6);
    } else {
      ctx.fillText(criterion.name, labelX, labelY);
    }
  });

  // Draw concentric circles (grid)
  for (let i = 1; i <= 5; i++) {
    const r = (radius * i) / 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Helper function to draw data points
  const drawDataPoints = (data: number[], color: string, isDashed: boolean = false, lineWidth: number = 2) => {
    ctx.beginPath();
    
    selectedCriteria.forEach((criterion, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = Math.max(0, Math.min(5, data[i])); // Clamp to 0-5 range
      const r = (radius * value) / 5;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    if (isDashed) {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    
    // Fill with transparency
    const fillColor = color.replace('1)', '0.15)');
    ctx.fillStyle = fillColor;
    ctx.fill();
  };

  // Draw user requirements (dashed green line)
  drawDataPoints(
    selectedCriteria.map(c => c.userRating),
    'rgba(34, 197, 94, 1)',
    true,
    3
  );

  // Draw tool data
  const [, borderColor] = getToolColor(toolIndex);
  drawDataPoints(
    selectedCriteria.map(criterion => getToolRating(tool, criterion)),
    borderColor,
    false,
    2
  );

  // Add legend at the bottom
  const legendY = canvas.height - 20;
  
  // User requirements legend
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = 'rgba(34, 197, 94, 1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, legendY);
  ctx.lineTo(50, legendY);
  ctx.stroke();
  
  ctx.setLineDash([]);
  ctx.fillStyle = '#374151';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Your Rankings', 55, legendY + 3);
  
  // Tool legend  
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, legendY);
  ctx.lineTo(180, legendY);
  ctx.stroke();
  
  ctx.fillText(tool.name, 185, legendY + 3);
};

export async function POST(request: NextRequest) {
  try {
    const { tool, criteria, toolIndex = 0 } = await request.json();
    
    // If canvas is not available, return a placeholder response
    if (!createCanvas) {
      console.log('Canvas not available, returning placeholder for', tool.name);
      return NextResponse.json({ 
        success: false, 
        error: 'Canvas module not available',
        toolName: tool.name,
        imageUrl: null
      });
    }
    
    if (!tool || !criteria) {
      return NextResponse.json({ error: 'Missing tool or criteria data' }, { status: 400 });
    }

    // Create canvas
    const canvas = createCanvas(300, 300);
    
    // Generate the radar chart
    createRadarChart(tool, criteria, canvas, toolIndex);
    
    // Convert to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: dataUrl,
      toolName: tool.name 
    });
    
  } catch (error) {
    console.error('Chart generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate chart',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}