import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client (with fallback for missing env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Webhook signing secret from Resend
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex');
    
  return `sha256=${expectedSignature}` === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase not configured for webhook handler');
      return NextResponse.json(
        { message: 'Service not configured' },
        { status: 503 }
      );
    }
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('resend-signature');

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET && !verifySignature(body, signature || '', WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    const { type, data } = webhookData;

    console.log('📨 Resend webhook received:', {
      type,
      messageId: data?.email_id,
      timestamp: new Date().toISOString()
    });

    // Store webhook event in database
    try {
      const { data: webhookEvent, error: webhookError } = await supabase
        .from('email_webhook_events')
        .insert({
          resend_message_id: data?.email_id,
          event_type: type,
          event_data: data,
          processed: false
        });

      if (webhookError) {
        console.error('Failed to store webhook event:', webhookError);
        return NextResponse.json(
          { message: 'Failed to store webhook event' },
          { status: 500 }
        );
      }

      console.log('✅ Webhook event stored:', webhookEvent);

    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json(
        { message: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    // Process specific webhook events
    switch (type) {
      case 'email.sent':
        console.log('📤 Email sent:', data?.email_id);
        break;
        
      case 'email.delivered':
        console.log('📬 Email delivered:', data?.email_id);
        break;
        
      case 'email.opened':
        console.log('👀 Email opened:', data?.email_id);
        break;
        
      case 'email.clicked':
        console.log('🖱️ Email clicked:', data?.email_id);
        break;
        
      case 'email.bounced':
        console.log('⚠️ Email bounced:', data?.email_id);
        break;
        
      case 'email.complained':
        console.log('🚫 Spam complaint:', data?.email_id);
        break;
        
      default:
        console.log('❓ Unknown webhook type:', type);
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
