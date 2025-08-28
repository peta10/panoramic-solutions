'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

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
    <footer className="border-t border-midnight/10 bg-gradient-to-br from-slate-50 to-blue-50/30 text-midnight">
      <motion.div 
        className="container mx-auto px-4 py-12 md:px-6 lg:px-8 max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          {/* Logo and Description */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              variants={itemVariants}
            >
              <div className="relative h-10 w-10">
                <Image
                  src="/images/Logo_Panoramic_Solutions.webp"
                  alt="Panoramic Solutions Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-midnight">
                Panoramic Solutions
              </span>
            </motion.div>
            <motion.p 
              className="text-midnight/70 mb-6 leading-relaxed"
              variants={itemVariants}
            >
              End-to-end excellence in software development, SaaS architecture, and project management solutions.
            </motion.p>
            
            {/* Contact Info */}
            <motion.div 
              className="mb-6 space-y-2 text-sm text-midnight/70"
              variants={itemVariants}
            >
              <p className="font-medium text-midnight">Get in touch</p>
              <p>Salt Lake City, Utah</p>
              <p>Matt.Wagner@panoramic-solutions.com</p>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-6 text-lg font-bold text-midnight"
              variants={itemVariants}
            >
              Quick Links
            </motion.h3>
            <motion.nav 
              className="space-y-1.5"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link href="/" className="block text-midnight/70 hover:text-alpine transition-colors duration-200 font-medium">
                  Home
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/offerings" className="block text-midnight/70 hover:text-alpine transition-colors duration-200 font-medium">
                  Offerings
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/about" className="block text-midnight/70 hover:text-alpine transition-colors duration-200 font-medium">
                  About
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/contact" className="block text-midnight/70 hover:text-alpine transition-colors duration-200 font-medium">
                  Contact
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-6 text-lg font-bold text-midnight"
              variants={itemVariants}
            >
              Products
            </motion.h3>
            <motion.nav 
              className="space-y-3"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link href="/ppm-tool" className="block text-midnight/70 hover:text-alpine transition-colors duration-200 font-medium">
                  PPM Tool Finder
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-sm text-midnight/60 leading-relaxed">
                  Discover the perfect project management tool for your organization with our interactive comparison platform.
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        </div>
        
        {/* Footer Bottom */}
        <motion.div 
          className="mt-8 flex justify-center border-t border-midnight pt-6 text-center"
          variants={itemVariants}
        >
          <motion.p 
            className="text-sm text-midnight/70"
            variants={itemVariants}
          >
            © 2025 Panoramic Solutions. All rights reserved.
          </motion.p>
        </motion.div>
      </motion.div>
    </footer>
  )
}