// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import posthog from 'posthog-js';

// Initialize Sentry
Sentry.init({
  dsn: "https://fa3b2e52ff86598ca8168008a1721771@o4509905344790528.ingest.us.sentry.io/4509905345773568",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;