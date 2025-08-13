export interface BaseComponent {
  className?: string
  children?: React.ReactNode
}

export interface AnimationProps {
  delay?: number
  duration?: number
  ease?: string
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

export interface TestimonialData {
  quote: string
  author: string
  title: string
  company: string
  rating: number
  image?: string
}

export interface ServiceData {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  benefits: string[]
}