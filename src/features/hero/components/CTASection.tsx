'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-alpine">
      <div className="container max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Let&apos;s Build a Better Way to Work
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Partner with Team Panoramic to reimagine how your organization can utilize user-centric digital technologies
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-gray-100 text-alpine font-semibold px-6 sm:px-8 py-3 sm:py-4"
            style={{ minHeight: '48px' }}
          >
            <a 
              href="https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
