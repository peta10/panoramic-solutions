import { Metadata } from 'next'
import { generateSiteMetadata } from '@/shared/utils/seo'
import { ServicesPageContent } from '@/features/services/components/ServicesPageContent'

export const metadata: Metadata = generateSiteMetadata({
  title: 'Our Services | Panoramic Solutions',
  description: 'Comprehensive project management, SaaS architecture, and digital transformation services. Expert implementation of business systems and enterprise automations.',
  keywords: 'project management services, SaaS architecture, business systems implementation, enterprise automation, digital transformation, Utah consulting',
  canonicalUrl: 'https://panoramicsolutions.com/services',
})

export default function ServicesPage() {
  return <ServicesPageContent />
}