import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  // This endpoint provides JavaScript code to clear localStorage
  // Since we can't directly access localStorage from the server
  const clearScript = `
    // Clear PPM Tool guided ranking data
    localStorage.removeItem('guidedRankingAnswers');
    localStorage.removeItem('personalizationData');
    
    // Clear any other PPM tool related data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('ppm') || key.startsWith('guided') || key.startsWith('criteria'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('🧹 Cleared localStorage for fresh testing');
    return { cleared: keysToRemove.length + 2, message: 'localStorage cleared successfully' };
  `;

  return NextResponse.json({
    success: true,
    script: clearScript,
    message: 'Use the provided script in browser console to clear localStorage'
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to get localStorage clearing script',
    instructions: [
      '1. POST to this endpoint to get the clearing script',
      '2. Copy the script from the response',
      '3. Paste and run it in your browser console',
      '4. Refresh the page and start fresh testing'
    ]
  });
}
