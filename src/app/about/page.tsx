'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from '@/shared/utils/motion';
import {
  Award,
  Users,
  Mountain,
  ArrowRight,
  Mail,
  Linkedin,
  Calendar,
  FileText,
  Globe,
  Code
} from 'lucide-react';

const certifications = [
  {
    name: 'PMP® - Project Management Professional',
    issuer: 'Project Management Institute (PMI)',
    year: 'Current',
    image: '/images/certifications/pmp.png',
  },
  {
    name: 'Certified SAFe 6 Agilist',
    issuer: 'Scaled Agile, Inc.',
    year: 'Current',
    image: '/images/certifications/safe.png',
  },
  {
    name: 'Airtable Builder Accreditation',
    issuer: 'Airtable',
    year: 'Current',
    image: '/images/certifications/airtable.png',
  },
  {
    name: 'Smartsheet Core Product Certified',
    issuer: 'Smartsheet',
    year: 'Current',
    image: '/images/certifications/smartsheet.png',
  },
];

const personalStats = [
  { value: '15+', label: 'Years Experience', prefix: '', suffix: '' },
  { value: '100+', label: 'Digital Transformations', prefix: '', suffix: '' },
  { value: '98', label: 'Client Satisfaction', prefix: '', suffix: '%' },
];

export default function PPMToolFinderPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - Photo */}
            <motion.div
              variants={slideInLeft}
              initial="initial"
              animate="animate"
              className="order-2 lg:order-1"
            >
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <Image
                    src="/images/Wagner_Headshot_2024.webp"
                    alt="Matt Wagner - Solutions Architect & Founder at Panoramic Solutions"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200">
                  <div className="text-xl sm:text-2xl font-bold text-alpine">PMP®</div>
                  <div className="text-xs sm:text-sm text-gray-600">SAFe 6 Agilist</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Story */}
            <motion.div
              variants={slideInRight}
              initial="initial"
              animate="animate"
              className="order-1 lg:order-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-midnight mb-4 sm:mb-6">
                Meet <span className="text-midnight">Matt Wagner</span>
              </h1>
              
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  As a Solutions Architect and founder of Panoramic Solutions, I specialize in 
                  leading projects that intersect operations and digitization, helping organizations 
                  reimagine how they can utilize user-centric digital technologies.
                </p>
                
                <p>
                  With a strategic mindset rooted in my Mechanical Engineering background from 
                  Virginia Tech and a focus on personal relationships, I drive innovation and 
                  efficiency by integrating cutting-edge technologies with operational processes.
                </p>
                
                <p>
                  My expertise spans SaaS Architecture, Enterprise Automations, Business Systems 
                  Implementation, and Application Development—all designed to maximize value during 
                  organizational transformation and ensure clients maintain their competitive edge.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-alpine hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4" 
                  style={{ minHeight: '48px' }}
                >
                  <a 
                    href="https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book A Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-4 sm:mb-6">
              Professional <span className="text-midnight">Experience</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Expertise spanning multiple industries with a focus on maximizing value through digital transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 mt-12">
            {/* Global PMO Partners */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-alpine" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-midnight">Global PMO Partners</h3>
                  <p className="text-lg text-alpine font-semibold mb-2">Senior PMO Consultant & Solutions Architect</p>
                  <div className="prose text-gray-600">
                    <p>
                      Matt leads digital transformation initiatives that bridge the gap between project management theory and practical execution.
                    </p>
                    <p className="mt-4 font-medium">Published article:</p>
                    <a 
                      href="https://www.smartsheet.com/content/project-management-kpi-examples" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-alpine hover:text-blue-700 flex items-center gap-2 mt-1"
                    >
                      <Globe className="h-4 w-4" />
                      <span>33 Essential Project Management KPI Examples by Category & Type</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Flowserve */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Code className="h-8 w-8 text-alpine" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-midnight">Flowserve</h3>
                  <p className="text-lg text-alpine font-semibold mb-2">Project Engineer</p>
                  <div className="prose text-gray-600">
                    <p>
                      Matt applied his engineering background to streamline production processes and improve project delivery timelines.
                    </p>
                    <p className="mt-4 font-medium">Published article:</p>
                    <a 
                      href="https://www.smartsheet.com/customers/flowserve" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-alpine hover:text-blue-700 flex items-center gap-2 mt-1"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Flowserve uses Smartsheet to gain better visibility into production processes, get products to customers faster, and be more proactive</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-4 sm:mb-6">
              <span className="text-midnight">Certifications</span> & Credentials
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Continuous learning and professional development to stay at the forefront 
              of digital transformation and project management best practices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
                  <CardContent className="p-6 sm:p-8">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Award className="h-8 w-8 sm:h-12 sm:w-12 text-alpine" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-midnight mb-2">
                      {cert.name}
                    </h3>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{cert.issuer}</p>
                    <p className="text-xs sm:text-sm text-alpine font-medium">{cert.year}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Section - Beyond Business */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-4 sm:mb-6">
              Skills & <span className="text-midnight">Specialties</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized expertise in key areas that drive digital transformation and operational excellence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-midnight mb-3 flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Globe className="h-5 w-5 text-alpine" />
                </div>
                SaaS Architecture
              </h3>
              <p className="text-gray-600">Enterprise-grade SaaS platform design and implementation with focus on scalability, security, and performance optimization.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-midnight mb-3 flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Code className="h-5 w-5 text-alpine" />
                </div>
                Enterprise Automations
              </h3>
              <p className="text-gray-600">Streamline operations and eliminate manual processes through intelligent automation solutions that integrate with existing systems.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-midnight mb-3 flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-alpine" />
                </div>
                Business Systems Implementation
              </h3>
              <p className="text-gray-600">End-to-end implementation of business systems including Airtable, Smartsheet, and custom solutions tailored to your needs.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-midnight mb-3 flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-alpine" />
                </div>
                Application Development
              </h3>
              <p className="text-gray-600">Custom software solutions to meet your business needs, with a focus on user experience and integration with existing systems.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-midnight mb-3 flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Mountain className="h-5 w-5 text-alpine" />
                </div>
                Project Portfolio Management
              </h3>
              <p className="text-gray-600">Strategic oversight and optimization of project portfolios to ensure alignment with business goals and maximize return on investment.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Links Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-4 sm:mb-6">
              Get in <span className="text-midnight">Touch</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your digital transformation journey? Connect with Matt directly.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a 
              href="mailto:Matt.Wagner@Panoramic-Solutions.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-alpine" />
              </div>
              <h3 className="font-semibold text-midnight mb-1">Email</h3>
              <p className="text-alpine text-sm text-center">Matt.Wagner@Panoramic-Solutions.com</p>
            </motion.a>
            
            <motion.a 
              href="https://www.linkedin.com/in/matt-wagner33/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Linkedin className="h-6 w-6 text-alpine" />
              </div>
              <h3 className="font-semibold text-midnight mb-1">LinkedIn</h3>
              <p className="text-alpine text-sm text-center">Connect with me on LinkedIn</p>
            </motion.a>
            
            <motion.a 
              href="https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-alpine" />
              </div>
              <h3 className="font-semibold text-midnight mb-1">Schedule</h3>
              <p className="text-alpine text-sm text-center">Book a meeting with Matt</p>
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-alpine">
        <div className="container max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Let's Transform Your Operations Together
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Ready to reimagine how your organization can utilize user-centric digital technologies? 
              Let's start with a conversation about your transformation goals.
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
                Book A Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}