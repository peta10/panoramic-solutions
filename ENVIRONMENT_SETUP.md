# Environment Setup for Admin Portal

## Required Environment Variables

To make the admin portal functional, you need to set up the following environment variables:

### For Local Development

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for AI-generated analysis summaries)
OPENAI_API_KEY=your_openai_api_key
```

### For Production (Netlify, Vercel, etc.)

Set these environment variables in your hosting platform:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Found in: Supabase Dashboard → Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key
   - Found in: Supabase Dashboard → Settings → API
   - This is the public anonymous key (not the service role key)

3. **OPENAI_API_KEY**: Your OpenAI API key for natural language analysis
   - Format: `sk-...` (starts with sk-)
   - Found in: OpenAI Dashboard → API Keys
   - Used for generating human-like analysis summaries in email reports

## Getting Supabase Credentials

1. **Sign up/Login** to [Supabase](https://supabase.com)
2. **Create a new project** or select existing one
3. **Go to Settings** → API
4. **Copy the Project URL** and **anon/public key**

## Database Setup

The admin portal expects these database tables:

- `admin_users` - Contains admin user permissions
- `tools` - PPM tools data
- `criteria` - Rating criteria
- Various other tables for tool management

## Testing Configuration

Once environment variables are set:

1. **Restart your development server**
2. **Visit** `/admin`
3. **Check for configuration warnings**
4. **Try signing up/signing in**

## Troubleshooting

### "Configuration Required" Warning
- Environment variables are missing or incorrect
- Check variable names are exactly as specified
- Restart development server after adding variables

### "Authentication service not configured"
- Supabase URL or key is invalid
- Check for typos in environment variables
- Verify keys are from the correct Supabase project

### Multiple GoTrueClient Instances Warning
- This has been fixed in the code
- Clear browser cache if you still see it
- Should not affect functionality

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables in production
- The anon key is safe for client-side use
- Keep service role keys private and secure
