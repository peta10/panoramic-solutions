import { HeroSection } from '@/features/hero/components/HeroSection'
import { ServicesSection } from '@/features/services/components/ServicesSection'
import { TestimonialsSection } from '@/features/testimonials/components/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
    </>
  )
}