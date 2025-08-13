import { Metadata } from 'next'
import { generateSiteMetadata } from '@/shared/utils/seo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Filter, Zap, CheckCircle } from 'lucide-react'

export const metadata: Metadata = generateSiteMetadata({
  title: 'PPM Tool Finder | Find Your Perfect Project Management Platform',
  description: 'Interactive PPM Tool Finder to help you discover the ideal Project Portfolio Management solution for your organization. Compare features, pricing, and capabilities.',
  keywords: 'PPM Tool Finder, Project Portfolio Management, Project Management Software, PPM Platform Comparison',
  canonicalUrl: 'https://panoramicsolutions.com/products/ppm-tool-finder',
})

export default function PPMToolFinderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-alpine to-summit rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Search className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-midnight">
            PPM <span className="text-gradient bg-gradient-to-r from-alpine to-summit bg-clip-text text-transparent">Tool Finder</span>
          </h1>
          
          <p className="text-xl text-midnight/70 max-w-4xl mx-auto mb-12 leading-relaxed">
            Discover the perfect Project Portfolio Management platform for your organization. 
            Our interactive tool analyzes your requirements and recommends the best PPM solutions 
            from leading vendors in the market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-alpine hover:bg-summit text-white px-8 py-4">
              Start Tool Finder
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4" asChild>
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight mb-6">
              How It Works
            </h2>
            <p className="text-xl text-midnight/70 max-w-3xl mx-auto">
              Our intelligent recommendation engine evaluates your specific needs 
              and matches you with the most suitable PPM platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-alpine/20 to-summit/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Filter className="h-8 w-8 text-alpine" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-4">
                1. Define Requirements
              </h3>
              <p className="text-midnight/70">
                Answer questions about your team size, industry, budget, and key features you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-alpine/20 to-summit/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-alpine" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-4">
                2. Get Matches
              </h3>
              <p className="text-midnight/70">
                Our algorithm instantly analyzes 20+ leading PPM platforms and ranks them by fit.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-alpine/20 to-summit/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-alpine" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-4">
                3. Compare & Decide
              </h3>
              <p className="text-midnight/70">
                Review detailed comparisons, pricing, and implementation recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-midnight mb-6">
                Why Use Our Tool Finder?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-summit/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-summit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-2">Save Time & Money</h3>
                    <p className="text-midnight/70">Avoid costly implementation mistakes by finding the right fit from the start.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-summit/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-summit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-2">Expert Insights</h3>
                    <p className="text-midnight/70">Recommendations based on 15+ years of implementation experience.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-summit/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-summit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-2">Comprehensive Database</h3>
                    <p className="text-midnight/70">Compare features, pricing, and capabilities of 20+ leading platforms.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-summit/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-summit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-2">Unbiased Results</h3>
                    <p className="text-midnight/70">Independent analysis with no vendor bias or hidden agendas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-midnight mb-6">Ready to Find Your Perfect PPM Tool?</h3>
              <p className="text-midnight/70 mb-8">
                Join hundreds of organizations who have found their ideal project management platform using our tool.
              </p>
              <Button size="lg" className="w-full bg-alpine hover:bg-summit">
                Launch PPM Tool Finder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-midnight/50 mt-4 text-center">
                Takes 5-10 minutes • No registration required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-midnight via-alpine to-summit">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Implementation Support?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Once you've found your ideal PPM platform, our implementation experts can help 
            ensure a successful deployment and user adoption.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-alpine hover:bg-white/90"
            asChild
          >
            <a href="https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt" target="_blank" rel="noopener noreferrer">
              Schedule Implementation Consultation
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
