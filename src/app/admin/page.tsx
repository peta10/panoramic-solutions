'use client';

import { AdminDashboard } from '@/components/admin/AdminDashboard';

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminDashboard />;
}
