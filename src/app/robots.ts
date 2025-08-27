import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/ppm-tool-embed/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      }
    ],
    sitemap: 'https://panoramic-solutions.com/sitemap.xml',
    host: 'https://panoramic-solutions.com',
  }
}
