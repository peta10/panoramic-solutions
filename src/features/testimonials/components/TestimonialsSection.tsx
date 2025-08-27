'use client'

import { motion } from 'framer-motion'
import { TestimonialCarousel } from './TestimonialCarousel'
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
    transform: "translateZ(0)"
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

export function TestimonialsSection() {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <section ref={ref} className="mobile-py bg-snow">
      <div className="container max-w-4xl mx-auto mobile-px">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          variants={fastFadeIn}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
        >
                     <h2 className="section-heading-mobile font-bold text-midnight mb-3 sm:mb-4">
             What Our Clients Say
           </h2>
          <p className="text-midnight/70 text-base sm:text-lg">
            Real results from organizations that trusted us with their digital transformation
          </p>
        </motion.div>

        <motion.div
          variants={slideInUpFast}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
          style={{ willChange: 'transform, opacity' }}
        >
          <TestimonialCarousel className="max-w-3xl mx-auto" autoPlay={true} interval={6000} backgroundColor="white" />
        </motion.div>
      </div>
    </section>
  )
}