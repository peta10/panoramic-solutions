'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
}

export function Footer() {
  return (
    <footer className="border-t border-midnight/10 bg-white text-midnight">
      <motion.div 
        className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              variants={itemVariants}
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/images/Logo_Panoramic_Solutions.webp"
                  alt="Panoramic Solutions Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-midnight">
                Panoramic Solutions
              </span>
            </motion.div>
            <motion.p 
              className="text-sm text-midnight/70 mb-4"
              variants={itemVariants}
            >
              End-to-end excellence in software development, SaaS architecture, and project management solutions.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-4 text-lg font-semibold"
              variants={itemVariants}
            >
              Quick Links
            </motion.h3>
            <motion.nav 
              className="space-y-0.5 text-sm"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link href="/" className="block transition-colors duration-200 hover:text-alpine">
                  Home
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/offerings" className="block transition-colors duration-200 hover:text-alpine">
                  Offerings
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link href="/about" className="block transition-colors duration-200 hover:text-alpine">
                  About
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/contact" className="block transition-colors duration-200 hover:text-alpine">
                  Contact
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-4 text-lg font-semibold"
              variants={itemVariants}
            >
              Contact Us
            </motion.h3>
            <motion.address 
              className="space-y-2 text-sm not-italic text-midnight/70 mb-4"
              variants={itemVariants}
            >
              <p>Salt Lake City, Utah</p>
              <p className="whitespace-nowrap">Email: Matt.Wagner@panoramic-solutions.com</p>
            </motion.address>
            
            {/* Social Media Buttons */}
            <motion.div 
              className="flex space-x-3"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white border-midnight/20 text-midnight hover:bg-alpine hover:text-white hover:border-alpine transition-all duration-200"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white border-midnight/20 text-midnight hover:bg-alpine hover:text-white hover:border-alpine transition-all duration-200"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white border-midnight/20 text-midnight hover:bg-alpine hover:text-white hover:border-alpine transition-all duration-200"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white border-midnight/20 text-midnight hover:bg-alpine hover:text-white hover:border-alpine transition-all duration-200"
                  onClick={() => window.open('https://www.linkedin.com/company/panoramicsolutions/', '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Footer Bottom */}
        <motion.div 
          className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-midnight/10 pt-6 text-center md:flex-row"
          variants={itemVariants}
        >
          <motion.p 
            className="text-sm text-midnight/70"
            variants={itemVariants}
          >
            © 2025 Panoramic Solutions. All rights reserved.
          </motion.p>
          <motion.nav 
            className="flex gap-4 text-sm"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link href="/privacy" className="transition-colors duration-200 hover:text-alpine text-midnight/70">
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/terms" className="transition-colors duration-200 hover:text-alpine text-midnight/70">
                Terms of Service
              </Link>
            </motion.div>
          </motion.nav>
        </motion.div>
      </motion.div>
    </footer>
  )
}