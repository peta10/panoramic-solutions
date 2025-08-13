'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ServiceCard } from './ServiceCard'
import { ArrowRight, Cloud, Zap, Settings } from 'lucide-react'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'

const fastFadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
}

const slideInUpFast = {
  initial: { 
    opacity: 0, 
    y: 20,
    transform: "translateZ(0)" // Force GPU acceleration
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    }
  },
}

export function ServicesSection() {
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver()

  return (
    <section ref={sectionRef} className="mobile-py bg-snow">
      <div className="container max-w-6xl mx-auto mobile-px">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          variants={fastFadeIn}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
        >
          <h2 className="heading-mobile font-bold text-midnight mb-4 sm:mb-6">
            Core <span className="text-midnight">Specialties</span>
          </h2>
          <p className="subheading-mobile text-midnight/70 max-w-3xl mx-auto px-4">
            Comprehensive solutions for modern digital transformation challenges
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mobile-gap max-w-5xl mx-auto mb-8 sm:mb-12">
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            style={{ willChange: 'transform, opacity' }}
          >
            <ServiceCard
              icon={Cloud}
              title="SaaS Architecture"
              excerpt="Enterprise-grade SaaS platform design and implementation with focus on scalability, security, and performance optimization."
              showLearnMore={false}
            />
          </motion.div>
          
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            transition={{ delay: 0.1 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <ServiceCard
              icon={Zap}
              title="Enterprise Automations"
              excerpt="Streamline operations and eliminate manual processes through intelligent automation solutions that integrate with existing systems."
              showLearnMore={false}
            />
          </motion.div>
          
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <ServiceCard
              icon={Settings}
              title="Business Systems Implementation"
              excerpt="End-to-end implementation of business systems including Airtable, Smartsheet, and custom solutions tailored to your needs."
              showLearnMore={false}
            />
          </motion.div>
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="btn-hover-lift bg-alpine hover:bg-summit text-white px-6 sm:px-8 py-3 sm:py-4"
            style={{ minHeight: '48px' }}
          >
            <Link href="/services">
              View All Services <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}