'use client';

import { StandaloneAdminApp } from './components/StandaloneAdminApp';

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <StandaloneAdminApp />;
}
