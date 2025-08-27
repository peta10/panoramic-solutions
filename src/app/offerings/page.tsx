import { Metadata } from 'next'
import { generateSiteMetadata } from '@/shared/utils/seo'
import { OfferingsPageContent } from '@/features/offerings/components/OfferingsPageContent'

export const metadata: Metadata = generateSiteMetadata({
  title: 'Our Offerings | Panoramic Solutions',
  description: 'Comprehensive project management, SaaS architecture, and digital transformation offerings. Expert implementation of business systems and enterprise automations.',
  keywords: 'project management offerings, SaaS architecture, business systems implementation, enterprise automation, digital transformation, Utah consulting',
  canonicalUrl: 'https://panoramicsolutions.com/offerings',
})

export default function OfferingsPage() {
  return <OfferingsPageContent />
}