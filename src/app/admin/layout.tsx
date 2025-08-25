import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import './admin.css'

// Add or edit your "generateMetadata" to include the Sentry trace data:
export function generateMetadata(): Metadata {
  return {
    title: 'Panoramic Solutions - Admin Dashboard',
    description: 'Tool Management Dashboard for Panoramic Solutions',
    robots: {
      index: false,
      follow: false,
    },
    other: {
      ...Sentry.getTraceData()
    }
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="admin-app">
        {children}
      </body>
    </html>
  )
}
