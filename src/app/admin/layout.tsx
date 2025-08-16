import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Panoramic Solutions - Admin Dashboard',
  description: 'Tool Management Dashboard for Panoramic Solutions',
  robots: {
    index: false,
    follow: false,
  },
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
