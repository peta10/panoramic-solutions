import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StructuredData } from '@/features/seo/components/StructuredData'
import { generateSiteMetadata } from '@/shared/utils/seo'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = generateSiteMetadata({
  title: 'Panoramic Solutions | SaaS Architecture & Digital Transformation',
  description: 'Solutions Architect Matt Wagner specializes in SaaS Architecture, Enterprise Automations, and Digital Transformation. PMP®, SAFe 6, Airtable & Smartsheet certified.',
  keywords: 'SaaS Architecture, Digital Transformation, Project Management, Enterprise Automation, Matt Wagner, PMP, SAFe, Utah Consultant',
  canonicalUrl: 'https://panoramicsolutions.com',
})

export const viewport: Viewport = {
  themeColor: '#0057B7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased bg-white">
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}