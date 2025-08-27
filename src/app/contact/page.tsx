'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TestimonialCarousel } from '@/features/testimonials/components/TestimonialCarousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp, slideInLeft, slideInRight } from '@/shared/utils/motion';
// Contact form now uses API route for submission and email notification
import { usePostHog } from '@/hooks/usePostHog';
import {
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function ContactPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const { trackForm, trackClick, capture, checkAndTrackVisitor, checkAndTrackActive, trackRanking } = usePostHog();

  // Track new visitor and active user on page load
  useEffect(() => {
    // Check and track new visitor
    checkAndTrackVisitor({
      page: 'contact',
      form_type: 'inquiry'
    });

    // Track first interaction as active user
    const handleFirstInteraction = () => {
      checkAndTrackActive('page_interaction', {
        page: 'contact',
        interaction_type: 'page_load'
      });
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [checkAndTrackVisitor, checkAndTrackActive]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      setError('Please fill in all required fields.');
      capture('contact_form_validation_error', { 
        missing_fields: [
          !formData.name && 'name',
          !formData.email && 'email',
          !formData.company && 'company',
          !formData.message && 'message'
        ].filter(Boolean)
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Track form submission attempt
    trackForm('contact_form', {
      has_name: !!formData.name,
      has_email: !!formData.email,
      has_company: !!formData.company,
      has_message: !!formData.message,
      message_length: formData.message.length
    });

    try {
      // Submit form via API route (handles both Supabase storage and email notification)
      const response = await fetch('/api/contact-form-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }

      // Track successful submission and ranking submittal
      capture('contact_form_submitted', {
        company: formData.company,
        message_length: formData.message.length,
        submission_time: Date.now(),
        submission_id: result.submissionId
      });

      // Track new ranking submittal
      trackRanking({
        form_type: 'contact_inquiry',
        company: formData.company,
        message_length: formData.message.length
      });

      // Success - show success page
      setShowSuccess(true);
    } catch (err: any) {
      console.error('Form submission error:', err);
      
      // Track submission error
      capture('contact_form_error', {
        error_message: err.message,
        error_type: err.name,
        submission_time: Date.now()
      });
      
      setError(err.message || 'Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleCall = () => {
    trackClick('schedule_call_button', { location: 'contact_success_page' });
    window.open('https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt', '_blank');
  };

  const isFormValid = formData.name && formData.email && formData.company && formData.message;

  if (showSuccess) {
    return (
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen flex items-center justify-center bg-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-alpine rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-4 sm:mb-6">
              Thank You!
            </h1>
            
            <p className="text-lg sm:text-xl text-midnight/70 mb-6 sm:mb-8">
              Your message has been received. Team Panoramic will review your information and respond 
              within 24 hours with next steps for your discovery call.
            </p>

            {/* Schedule Call Button */}
            <div className="mb-6 sm:mb-8">
              <Button 
                className="bg-alpine hover:bg-summit text-white text-lg px-8 py-4"
                onClick={handleScheduleCall}
                style={{ minHeight: '56px' }}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Schedule Your Discovery Call
              </Button>
            </div>

            <p className="text-midnight/60 text-sm sm:text-base">
              Prefer to email directly? Reach team Panoramic at{' '}
              <a href="mailto:Matt.Wagner@panoramic-solutions.com" className="text-alpine hover:text-summit">
                Matt.Wagner@panoramic-solutions.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
           {/* Main Form - 3 columns */}
           <div className="lg:col-span-3">
            <motion.div
              variants={slideInLeft}
              initial="initial"
              animate="animate"
            >
              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-midnight mb-3 sm:mb-4">
                  Let&apos;s Build What&apos;s Next
                </h1>
                <p className="text-base sm:text-lg text-midnight/70">
                  Change is easier when you have the right partner. Share your goals, and we&apos;ll create a plan that works for you.
                </p>
              </div>

              <Card className="shadow-xl border border-midnight/10 bg-white">
                <CardContent className="p-6 sm:p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">
                        Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="First & Last Name"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-white border-gray-300 text-midnight placeholder:text-gray-500 focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none disabled:opacity-50 rounded-md"
                        style={{ minHeight: '48px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@company.com"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-white border-gray-300 text-midnight placeholder:text-gray-500 focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none disabled:opacity-50 rounded-md"
                        style={{ minHeight: '48px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">
                        Company *
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your Company Name"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-white border-gray-300 text-midnight placeholder:text-gray-500 focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none disabled:opacity-50 rounded-md"
                        style={{ minHeight: '48px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">
                        What can we help you accomplish? *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your goals, challenges, or what you'd like to achieve..."
                        required
                        disabled={isSubmitting}
                        rows={6}
                        className="w-full bg-white border-gray-300 text-midnight placeholder:text-gray-500 focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none disabled:opacity-50 rounded-md resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      size="lg"
                      className="w-full bg-alpine hover:bg-alpine/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      style={{ minHeight: '48px' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

                     {/* Sidebar - 2 columns */}
           <div className="lg:col-span-2">
            <motion.div
              variants={slideInRight}
              initial="initial"
              animate="animate"
              className="space-y-6 sm:space-y-8"
            >
              {/* Contact Info */}
              <Card className="border border-midnight/10 bg-white">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-midnight mb-3 sm:mb-4">
                    Get In Touch
                  </h3>
                  <div className="space-y-4">

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-midnight text-sm">Email Matt</div>
                        <div className="text-alpine text-sm font-medium break-all">Matt.Wagner@panoramic-solutions.com</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-midnight text-sm">Location</div>
                        <div className="text-alpine text-sm font-medium">Salt Lake City, Utah</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card className="border border-midnight/10 bg-white">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-midnight mb-3 sm:mb-4">
                    What Clients Say
                  </h3>
                  <TestimonialCarousel className="h-auto" autoPlay={true} interval={4000} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

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
    </section>
  );
}
