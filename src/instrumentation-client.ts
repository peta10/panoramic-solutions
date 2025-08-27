// This file configures client-side initialization
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // Recommended defaults option for better data consistency
  defaults: '2025-05-24',
  // Enable automatic pageview capture
  capture_pageview: true,
  // Enable automatic session recording
  capture_pageleave: true,
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  // Loaded callback for additional configuration
  loaded: (posthog) => {
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      posthog.debug();
    }
    
    // Log successful initialization
    console.log('🎯 PostHog initialized successfully');
  }
});