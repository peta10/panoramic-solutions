-- Create email_reports table for storing user email reports and marketing data
CREATE TABLE IF NOT EXISTS email_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  email_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of email for privacy
  
  -- Report data
  selected_tools JSONB NOT NULL DEFAULT '[]',
  selected_criteria JSONB NOT NULL DEFAULT '[]',
  top_recommendations JSONB NOT NULL DEFAULT '[]',
  
  -- Email delivery tracking
  resend_message_id VARCHAR(255),
  email_status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, bounced, complained
  
  -- Analytics data
  tool_count INTEGER DEFAULT 0,
  criteria_count INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address INET,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Marketing flags
  marketing_consent BOOLEAN DEFAULT FALSE,
  unsubscribed BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT unique_email_hash UNIQUE (email_hash)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_reports_user_email ON email_reports (user_email);
CREATE INDEX IF NOT EXISTS idx_email_reports_email_hash ON email_reports (email_hash);
CREATE INDEX IF NOT EXISTS idx_email_reports_created_at ON email_reports (created_at);
CREATE INDEX IF NOT EXISTS idx_email_reports_resend_id ON email_reports (resend_message_id);
CREATE INDEX IF NOT EXISTS idx_email_reports_status ON email_reports (email_status);

-- Create webhook_events table for Resend webhook tracking
CREATE TABLE IF NOT EXISTS email_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resend_message_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- email.sent, email.delivered, email.bounced, etc.
  event_data JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_webhook_email_report 
    FOREIGN KEY (resend_message_id) 
    REFERENCES email_reports (resend_message_id) 
    ON DELETE SET NULL
);

-- Create index for webhook processing
CREATE INDEX IF NOT EXISTS idx_webhook_events_message_id ON email_webhook_events (resend_message_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON email_webhook_events (event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON email_webhook_events (processed);

-- Enable Row Level Security
ALTER TABLE email_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
-- For now, allowing all access - you should restrict this in production
CREATE POLICY "Enable all access for email_reports" ON email_reports FOR ALL USING (true);
CREATE POLICY "Enable all access for email_webhook_events" ON email_webhook_events FOR ALL USING (true);

-- Create function to update email status from webhooks
CREATE OR REPLACE FUNCTION process_email_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the corresponding email_report based on webhook event
  UPDATE email_reports 
  SET 
    email_status = CASE 
      WHEN NEW.event_type = 'email.delivered' THEN 'delivered'
      WHEN NEW.event_type = 'email.bounced' THEN 'bounced'
      WHEN NEW.event_type = 'email.complained' THEN 'complained'
      ELSE email_status
    END,
    delivered_at = CASE 
      WHEN NEW.event_type = 'email.delivered' THEN NOW()
      ELSE delivered_at
    END,
    opened_at = CASE 
      WHEN NEW.event_type = 'email.opened' THEN NOW()
      ELSE opened_at
    END,
    clicked_at = CASE 
      WHEN NEW.event_type = 'email.clicked' THEN NOW()
      ELSE clicked_at
    END
  WHERE resend_message_id = NEW.resend_message_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically process webhooks
CREATE TRIGGER trigger_process_email_webhook
  AFTER INSERT ON email_webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION process_email_webhook();
