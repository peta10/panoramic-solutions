import { HeroSection } from '@/features/hero/components/HeroSection'
import { WhyTeamPanoramicSection } from '@/features/hero/components/WhyTeamPanoramicSection'
import { OfferingsSection } from '@/features/offerings/components/OfferingsSection'
import { TestimonialsSection } from '@/features/testimonials/components/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyTeamPanoramicSection />
      <OfferingsSection />
      <TestimonialsSection />
    </>
  )
}