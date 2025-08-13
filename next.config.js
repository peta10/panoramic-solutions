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
    
    // Handle PDF generation libraries (same as PPM Tool)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false
    };

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