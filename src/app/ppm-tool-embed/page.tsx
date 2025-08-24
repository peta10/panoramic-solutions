import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'PPM Tool Finder - Interactive Tool',
  description: 'Interactive PPM Tool Finder application',
  robots: {
    index: false,
    follow: false,
  },
}

// This route redirects to the actual PPM tool
export default function PPMToolEmbedPage() {
  redirect('/ppm-tool')
}
