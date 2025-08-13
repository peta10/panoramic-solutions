import React from 'react';
import { useAuth } from '@/ppm-tool/shared/hooks/useAuth';
import { supabase } from '@/ppm-tool/shared/lib/supabase';

export const EnvironmentDebug: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = React.useState<string>('Checking...');

  React.useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from('criteria').select('count').limit(1);
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus('Connected');
        }
      } catch (err) {
        setSupabaseStatus(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    checkSupabase();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>User: {user ? user.email : 'Not logged in'}</div>
        <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Supabase: {supabaseStatus}</div>
        <div>URL: {window.location.href}</div>
      </div>
    </div>
  );
}; 