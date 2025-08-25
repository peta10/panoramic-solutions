import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Declare global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __supabase_ppm__: ReturnType<typeof createClient> | undefined;
}

// Create singleton Supabase client for PPM tool
function createSupabaseClient() {
  // Return existing instance if available
  if (global.__supabase_ppm__) {
    return global.__supabase_ppm__;
  }

  // Check if environment variables are configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured for PPM tool');
    return null;
  }
  
  // Create new client with explicit storage key (different from main)
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'sb-panoramic-ppm-auth-token', // Different key for PPM tool
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
  
  // Store globally to survive HMR in development
  if (typeof window !== 'undefined') {
    (window as any).__supabase_ppm__ = client;
  }
  if (typeof global !== 'undefined') {
    global.__supabase_ppm__ = client;
  }
  
  console.info('✅ PPM Supabase client initialized (singleton)');
  
  return client;
}

// Export singleton instance
export const supabase = createSupabaseClient();

export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey;
};