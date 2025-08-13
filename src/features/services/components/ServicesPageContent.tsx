'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fadeInUp, staggerContainer } from '@/shared/utils/motion'
import Link from 'next/link'
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Grid3X3,
  Code,
  FileCheck,
  Settings,
  Zap,
  Database,
  GitBranch,
  Layers,
  Rocket,
  Monitor,
  Wrench,
} from 'lucide-react'

interface ServiceItem {
  title: string
  description: string
  icon: React.ElementType
}

interface ServiceCategory {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  iconColor: string
  services: ServiceItem[]
  keyBenefits: string[]
  logos?: string[]
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'project-portfolio',
    title: 'Project & Portfolio Consulting',
    subtitle: 'Project portfolio management offerings with certified expertise',
    icon: Briefcase,
    iconColor: 'bg-alpine',
    services: [
      {
        title: 'Project Management Tool Assessment',
        description: 'Evaluation and selection of project portfolio management tools',
        icon: FileCheck,
      },
      {
        title: 'Project Portfolio Management (PPM) Implementation',
        description: 'Configure PPM tools to meet your organization\'s needs',
        icon: Settings,
      },
      {
        title: 'Project Management Support',
        description: 'Guidance, resources and tools to ensure maximum value delivery',
        icon: Wrench,
      },
    ],
    keyBenefits: [
      'Streamlined tool selection',
      'Optimized project delivery',
      'Enhanced portfolio visibility',
      'Improved resource utilization',
    ],
  },
  {
    id: 'business-applications',
    title: 'Business Applications',
    subtitle: 'End-to-end business solutions and system implementations',
    icon: Grid3X3,
    iconColor: 'bg-summit',
    services: [
      {
        title: 'SaaS Architecture, Implementation & Managed Services',
        description: 'Expert implementation & management of Smartsheet, Airtable, Miro and other cloud-based solutions',
        icon: Database,
      },
      {
        title: 'System Integration',
        description: 'Seamless connection of business applications and workflows',
        icon: GitBranch,
      },
      {
        title: 'Business Process Automation',
        description: 'Streamlined automation of repetitive tasks and workflows',
        icon: Zap,
      },
    ],
    keyBenefits: [
      'Rapid SaaS deployment',
      'Seamless system integration',
      'Automated workflows',
      'Enhanced collaboration',
    ],
    logos: ['smartsheet', 'airtable', 'miro'],
  },
  {
    id: 'development-integration',
    title: 'Development & Integration Services',
    subtitle: 'Custom development and technical integration solutions',
    icon: Code,
    iconColor: 'bg-alpine',
    services: [
      {
        title: 'Rapid Prototyping',
        description: 'Accelerate time to market with AI-powered prototyping and development solutions',
        icon: Rocket,
      },
      {
        title: 'Application Development',
        description: 'Custom software solutions to meet your business needs',
        icon: Monitor,
      },
      {
        title: 'Technical Architecture & Integration',
        description: 'Expert design and implementation of scalable technical solutions with seamless system integrations',
        icon: Layers,
      },
    ],
    keyBenefits: [
      'Custom-built solutions',
      'Scalable architecture',
      'Seamless integrations',
      'Future-proof design',
    ],
  },
]

export function ServicesPageContent() {
  const [expandedService, setExpandedService] = useState<string | null>('project-portfolio')

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-white">
        <div className="container max-w-6xl mx-auto mobile-px">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="heading-mobile font-bold text-alpine mb-4 sm:mb-6"
              variants={fadeInUp}
            >
              Our Services
            </motion.h1>
            <motion.p
              className="subheading-mobile text-midnight/70 mb-8 sm:mb-12 leading-relaxed"
              variants={fadeInUp}
            >
              Comprehensive services & solutions tailored to your business needs
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mobile-py bg-snow">
        <div className="container max-w-6xl mx-auto mobile-px">
          <div className="space-y-6">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-midnight/10 shadow-lg overflow-hidden">
                  <button
                    onClick={() => toggleService(category.id)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-alpine focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-between p-6 sm:p-8 hover:bg-snow/50 transition-colors">
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className={`p-3 sm:p-4 rounded-lg ${category.iconColor} text-white flex-shrink-0`}>
                          <category.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-alpine mb-1 sm:mb-2">
                            {category.title}
                          </h3>
                          <p className="text-midnight/70 text-sm sm:text-base">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {category.logos && (
                          <div className="hidden sm:flex items-center space-x-2">
                            <div className="w-8 h-8 bg-alpine/10 rounded flex items-center justify-center">
                              <Database className="h-4 w-4 text-alpine" />
                            </div>
                            <div className="w-8 h-8 bg-summit/10 rounded flex items-center justify-center">
                              <Grid3X3 className="h-4 w-4 text-summit" />
                            </div>
                            <div className="w-8 h-8 bg-alpine/10 rounded flex items-center justify-center">
                              <Layers className="h-4 w-4 text-alpine" />
                            </div>
                          </div>
                        )}
                        <div className="text-alpine">
                          {expandedService === category.id ? (
                            <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
                          ) : (
                            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedService === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-midnight/10"
                      >
                        <div className="p-6 sm:p-8">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            {/* Services List */}
                            <div className="lg:col-span-2 space-y-6">
                              {category.services.map((service, serviceIndex) => (
                                <motion.div
                                  key={serviceIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: serviceIndex * 0.1 }}
                                  className="flex items-start space-x-4"
                                >
                                  <div className="flex-shrink-0 text-summit">
                                    <ArrowRight className="h-5 w-5 mt-1" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-semibold text-midnight mb-2">
                                      {service.title}
                                    </h4>
                                    <p className="text-midnight/70 text-sm sm:text-base">
                                      {service.description}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Key Benefits */}
                            <div className="lg:col-span-1">
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                              >
                                <h4 className="text-lg font-semibold text-alpine mb-4">
                                  Key Benefits
                                </h4>
                                <div className="space-y-3">
                                  {category.keyBenefits.map((benefit, benefitIndex) => (
                                    <motion.div
                                      key={benefitIndex}
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4, delay: 0.4 + benefitIndex * 0.1 }}
                                      className="flex items-center space-x-3"
                                    >
                                      <CheckCircle className="h-5 w-5 text-summit flex-shrink-0" />
                                      <span className="text-midnight/80 text-sm sm:text-base">
                                        {benefit}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Methodology Section */}
      <section className="mobile-py bg-white">
        <div className="container max-w-6xl mx-auto mobile-px">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-mobile font-bold text-midnight mb-4 sm:mb-6">
              Our <span className="text-alpine">Methodology</span>
            </h2>
            <p className="subheading-mobile text-midnight/70 max-w-3xl mx-auto">
              A systematic approach rooted in engineering principles that delivers 
              consistent results across all digital transformation initiatives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mobile-gap">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'Deep dive into current operations, systems, and digital maturity assessment',
              },
              {
                step: '02',
                title: 'Architecture',
                description: 'Design scalable solutions that integrate with existing technology stack',
              },
              {
                step: '03',
                title: 'Implementation',
                description: 'Execute with precision using proven methodologies and best practices',
              },
              {
                step: '04',
                title: 'Optimization',
                description: 'Continuous improvement and knowledge transfer for long-term success',
              },
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-alpine text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-lg sm:text-2xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-midnight mb-3 sm:mb-4">
                  {phase.title}
                </h3>
                <p className="text-midnight/70 text-sm sm:text-base">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mobile-py bg-alpine">
        <div className="container max-w-6xl mx-auto text-center mobile-px">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-mobile font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="subheading-mobile text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Let's discuss how our comprehensive services can maximize value for your organization 
              and drive measurable business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="btn-hover-lift bg-summit hover:bg-summit/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4"
                style={{ minHeight: '48px' }}
                onClick={() => window.open('https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt', '_blank')}
              >
                Schedule a Call <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}