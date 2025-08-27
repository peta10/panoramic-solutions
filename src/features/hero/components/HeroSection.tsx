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
    <section ref={ref} className="relative h-screen sm:h-[75vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg"
          alt="Mountain panorama view"
          fill
          className="object-cover object-[center_30%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center min-h-screen sm:min-h-0 py-8 sm:py-0"
        variants={heroTitleContainer}
        initial="initial"
        animate="animate"
      >
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <motion.div
            variants={heroTitleLine}
            className="heading-mobile font-bold leading-tight"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}
          >
            End-to-End Excellence in
          </motion.div>
          <motion.div
            variants={heroTitleLine}
            className="heading-mobile font-bold leading-tight mt-1 sm:mt-2"
          >
            <span className="text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>Software & Project Management</span>
          </motion.div>
        </div>
        
        <motion.p
          className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8 text-snow/90 max-w-4xl mx-auto leading-relaxed"
          variants={heroSubtitle}
          style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7), 0 0 15px rgba(0,0,0,0.4)' }}
        >
          Professional software development, SaaS architecture, and project management services 
          that drive measurable business results for forward-thinking organizations.
        </motion.p>

        {/* PPM Tool Finder Highlight */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 border border-white/20 shadow-lg max-w-2xl mx-auto"
          variants={heroButtons}
        >
          <div className="text-center">
            <p className="text-white/90 text-sm sm:text-base mb-2 sm:mb-3 leading-relaxed">
              Get 100% free personalized recommendations with our intelligent Project Portfolio Management Tool assessment.
            </p>
            <Button
              className="btn-hover-lift bg-white hover:bg-white/90 text-midnight font-semibold px-4 sm:px-6 py-2 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
              onClick={() => window.open('/ppm-tool', '_self')}
            >
              Start Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="hidden sm:flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center w-full sm:max-w-none mx-auto"
          variants={heroButtons}
          transition={{ delay: 0.7 }}
        >
          <Button
            size="lg"
            className="btn-hover-lift bg-summit hover:bg-summit/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-2 border-summit text-base w-full sm:w-auto"
            style={{ minHeight: '48px' }}
            onClick={() => window.open('https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt', '_blank')}
          >
            Book A Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="btn-hover-lift border-2 border-white text-white hover:bg-white hover:text-midnight px-6 sm:px-8 py-3 sm:py-4 shadow-lg font-semibold bg-white/10 backdrop-blur-sm text-base"
            style={{ minHeight: '48px' }}
            onClick={() => window.open('/contact', '_self')}
          >
            Contact Us
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}