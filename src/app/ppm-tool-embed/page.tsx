import { Metadata } from 'next'
import { PPMToolEmbed } from '@/features/ppm-integration/components/PPMToolEmbed'

export const metadata: Metadata = {
  title: 'PPM Tool Finder - Interactive Tool',
  description: 'Interactive PPM Tool Finder application',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PPMToolEmbedPage() {
  return (
    <div className="min-h-screen">
      <PPMToolEmbed />
    </div>
  )
}
