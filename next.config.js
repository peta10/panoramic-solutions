const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,
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
    optimizeCss: true,
    optimizeServerReact: true,
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

    // Production optimizations
    if (!dev) {
      // Tree shaking and dead code elimination
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
  
  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'panoramic-solutions.com',
      },
      {
        protocol: 'https',
        hostname: 'panoramicsolutions.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
        source: '/services',
        destination: '/offerings',
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

