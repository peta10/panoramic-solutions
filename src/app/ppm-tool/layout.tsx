import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PPM Tool Finder | Find Your Perfect Portfolio Management Tool',
  description: 'Compare and find the best Portfolio and Project Management (PPM) tools based on your specific criteria. Interactive tool comparison with personalized recommendations.',
  keywords: 'PPM tools, portfolio management, project management, tool comparison, criteria-based selection',
}

export const viewport: Viewport = {
  themeColor: '#0057B7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function PPMToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-hidden">
        {children}
      </body>
    </html>
  )
}
