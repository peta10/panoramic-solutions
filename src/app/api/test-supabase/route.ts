import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (with fallback for missing env vars)
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function GET() {
  console.log('🔍 Testing Supabase Configuration...');
  console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key configured:', !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY));
  console.log('URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
  console.log('Using service key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY' : process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY' : 'NONE');
  
  if (!supabase) {
    return NextResponse.json({
      success: false,
      message: 'Supabase not configured',
      details: {
        url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        url_value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
      }
    });
  }

  try {
    // Test connection by trying to insert a test record
    console.log('💾 Testing Supabase insert...');
    const testData = {
      user_email: 'test@example.com',
      email_hash: 'test_hash_' + Date.now(),
      selected_tools: [{ name: 'Test Tool', id: 'test' }],
      selected_criteria: [{ name: 'Test Criteria', id: 'test', weight: 5 }],
      top_recommendations: [{ tool: { name: 'Test Tool' }, score: 90, rank: 1 }],
      tool_count: 1,
      criteria_count: 1,
      user_agent: 'Test Agent',
      resend_message_id: 'test_message_' + Date.now()
    };

    const { data: reportData, error: dbError } = await supabase
      .from('email_reports')
      .insert(testData)
      .select();

    if (dbError) {
      console.error('❌ Supabase insert error:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Supabase insert failed',
        error: {
          code: dbError.code,
          message: dbError.message,
          details: dbError.details
        }
      });
    }

    // Clean up test record
    if (reportData?.[0]?.id) {
      await supabase
        .from('email_reports')
        .delete()
        .eq('id', reportData[0].id);
    }

    console.log('✅ Supabase test successful!');
    return NextResponse.json({
      success: true,
      message: 'Supabase connection and insert test successful',
      test_record_id: reportData?.[0]?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Supabase test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Supabase test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
