import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if canvas is available
    let createCanvas: any;
    try {
      const canvasModule = await import('canvas');
      createCanvas = canvasModule.createCanvas;
      console.log('Canvas module loaded successfully');
    } catch (error) {
      console.error('Canvas module not available:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Canvas module not available',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Try to create a simple test image
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    
    // Draw a simple test pattern
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 50, 100, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Test', 100, 105);
    
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error in test-canvas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
