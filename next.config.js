const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-accordion', 
      '@radix-ui/react-tooltip',
      'framer-motion',
      'chart.js',
      'react-chartjs-2'
    ],
    webpackBuildWorker: true,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack optimizations for PPM Tool compatibility
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // PPM Tool compatibility and aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      'chart.js': 'chart.js/auto',
      '@/ppm-tool': path.resolve(__dirname, 'src/ppm-tool'),
      '@': path.resolve(__dirname, 'src')
    };
    
    // Ensure proper module resolution for external packages
    config.resolve.modules = [
      'node_modules',
      path.resolve(__dirname, 'node_modules')
    ];
    
    // Handle PDF generation libraries and canvas fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      canvas: false
    };

    // Handle canvas module for server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas'
      });
    }

    return config;
  },
  
  // Image optimizations
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com', 'panoramicsolutions.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Security and performance headers
  async headers() {
    return [
      {
        source: '/ppm-tool-embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'"
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  
  // Optimize for better Core Web Vitals
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // SEO redirects
  async redirects() {
    return [
      {
        source: '/offerings',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      }
    ]
  }
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "syntora-0o",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // Disable uploads if no auth token is available
    disableClientUploads: !process.env.SENTRY_AUTH_TOKEN,
    disableServerUploads: !process.env.SENTRY_AUTH_TOKEN,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
