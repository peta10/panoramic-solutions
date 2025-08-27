'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-midnight/10 shadow-lg rounded-lg p-6 sm:p-8 h-full">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-alpine/15 w-fit">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-alpine" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-semibold text-midnight">
          {title}
        </h3>
        
        <p className="text-midnight/70 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}

export function WhyTeamPanoramicSection() {
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
          <h2 className="section-heading-mobile font-bold text-midnight mb-4 sm:mb-6">
            Why Team Panoramic?
          </h2>
          <p className="text-base sm:text-lg text-midnight/70 max-w-4xl mx-auto px-4">
            Our team is committed to delivering digital tools and proven methodologies to propel your success!
            Blending deep technical expertise and project management excellence, we help you harness the
            power of solutions tailored to your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 mobile-gap max-w-5xl mx-auto">
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            style={{ willChange: 'transform, opacity' }}
          >
            <FeatureCard
              icon={Shield}
              title="End-to-End Excellence"
              description="Comprehensive offerings from strategic planning through implementation and ongoing support. We partner with you every step of the way."
            />
          </motion.div>
          
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            transition={{ delay: 0.1 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <FeatureCard
              icon={Users}
              title="Customer-Centric Approach"
              description="We prioritize understanding your unique needs and delivering solutions that drive measurable business value. Our collaborative team approach ensures seamless integration with your organization."
            />
          </motion.div>
          
          <motion.div
            variants={slideInUpFast}
            initial="initial"
            animate={isIntersecting ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <FeatureCard
              icon={Award}
              title="Certified Expertise"
              description="PMP® and SAFe® 6 certified professionals with extensive industry experience across project management, software development, and business process optimization."
            />
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-12 sm:mt-16"
          variants={fastFadeIn}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="btn-hover-lift bg-alpine hover:bg-summit text-white px-6 sm:px-8 py-3 sm:py-4"
              style={{ minHeight: '48px' }}
            >
              <Link href="/offerings">
                Our Offerings <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              className="btn-hover-lift bg-alpine hover:bg-summit text-white px-6 sm:px-8 py-3 sm:py-4"
              style={{ minHeight: '48px' }}
            >
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
