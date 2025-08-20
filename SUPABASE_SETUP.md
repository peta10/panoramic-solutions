# Supabase Environment Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vfqxzqhitumrxshrcqwr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcXh6cWhpdHVtcnhzaHJjcXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNjQ5MjQsImV4cCI6MjA1NTY0MDkyNH0.nmS9wBO364zKGHSRIsq_rUAkbYNhutWlU_zXAqfUd6U
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Configuration (if not already added)
RESEND_API_KEY=your_resend_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://panoramic-solutions.com
CONTACT_EMAIL=matt.wagner@panoramic-solutions.com
```

## How to Get Your Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/vfqxzqhitumrxshrcqwr
2. Navigate to **Settings** → **API**
3. Find the **Project API keys** section
4. Copy the **`service_role`** key (NOT the anon key)
5. Replace `your_service_role_key_here` in the `.env.local` file

## What Each Key Does

- **`NEXT_PUBLIC_SUPABASE_URL`**: The base URL for your Supabase project
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public key for frontend operations (reading data)
- **`SUPABASE_SERVICE_ROLE_KEY`**: Private key for server-side operations (writing sensitive data like email reports)

## After Adding Environment Variables

1. **Restart your development server**: `npm run dev`
2. **Test the email system** - emails should now be stored in Supabase
3. **Check the `email_reports` table** in your Supabase dashboard for stored reports

## Database Tables Created

The email system uses these tables:

- **`email_reports`**: Stores user emails, tool comparisons, and analysis results
- **`email_webhook_events`**: Tracks email delivery status from Resend webhooks

## Troubleshooting

If you see "⚠️ Supabase not configured - skipping database storage" in the logs:

1. Verify all environment variables are set in `.env.local`
2. Restart the development server
3. Check for typos in the environment variable names
4. Ensure the service role key has the correct permissions

## Testing

After setup, try sending an email report and check:

1. **Server logs** should show "📊 Report stored in Supabase"
2. **Supabase dashboard** → Tables → `email_reports` should show new entries
3. **Email delivery** should work with proper tracking
