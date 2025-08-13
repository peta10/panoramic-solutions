'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useHeroAnimation } from '../hooks/useHeroAnimation'

const heroTitleContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const heroTitleLine = {
  initial: { 
    opacity: 0, 
    y: 30,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
}

const heroSubtitle = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.3
    }
  },
}

const heroButtons = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.5
    }
  },
}

export function HeroSection() {
  const { ref } = useHeroAnimation()

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg"
          alt="Mountain panorama view"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center text-white mobile-px max-w-6xl mx-auto"
        variants={heroTitleContainer}
        initial="initial"
        animate="animate"
      >
        <div className="mb-4 sm:mb-6">
          <motion.div
            variants={heroTitleLine}
            className="heading-mobile font-bold leading-tight"
          >
            End-to-End Excellence in
          </motion.div>
          <motion.div
            variants={heroTitleLine}
            className="heading-mobile font-bold leading-tight mt-2"
          >
            <span className="text-white drop-shadow-lg">Software & Project Management</span>
          </motion.div>
        </div>
        
        <motion.p
          className="subheading-mobile mb-6 sm:mb-8 text-snow/90 max-w-4xl mx-auto leading-relaxed px-4"
          variants={heroSubtitle}
        >
          Professional software development, SaaS architecture, and project management services 
          that drive measurable business results for forward-thinking organizations.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto"
          variants={heroButtons}
        >
          <Button
            size="lg"
            className="btn-hover-lift bg-summit hover:bg-summit/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-2 border-summit text-base sm:text-sm"
            style={{ minHeight: '48px' }}
            onClick={() => window.open('https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt', '_blank')}
          >
            Book A Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="btn-hover-lift border-2 border-white text-white hover:bg-white hover:text-midnight px-6 sm:px-8 py-3 sm:py-4 shadow-lg font-semibold bg-white/10 backdrop-blur-sm text-base sm:text-sm"
            style={{ minHeight: '48px' }}
            onClick={() => window.open('/products/ppm-tool-finder', '_self')}
          >
            Find Your PPM Tool
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}