'use client'

import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization structured data
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Panoramic Solutions",
  "description": "Professional software development, SaaS architecture, and project management services that drive measurable business results for forward-thinking organizations.",
  "url": "https://panoramic-solutions.com",
  "logo": "https://panoramic-solutions.com/images/Logo_Panoramic_Solutions.webp",
  "foundingDate": "2020",
  "founder": {
    "@type": "Person",
    "name": "Matt Wagner",
    "jobTitle": "Solutions Architect & Founder",
    "image": "https://panoramic-solutions.com/images/Wagner_Headshot_2024.webp"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-801-555-0123",
    "contactType": "customer service",
    "email": "matt.wagner@panoramic-solutions.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Salt Lake City",
    "addressRegion": "Utah",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.linkedin.com/in/matt-wagner33/",
    "https://panoramic-solutions.com"
  ],
  "services": [
    {
      "@type": "Service",
      "name": "SaaS Architecture",
      "description": "Custom SaaS solutions and enterprise architecture design"
    },
    {
      "@type": "Service", 
      "name": "Project Portfolio Management",
      "description": "PPM consulting and digital transformation services"
    },
    {
      "@type": "Service",
      "name": "Enterprise Automations",
      "description": "Business process automation and workflow optimization"
    }
  ]
}

// Person structured data for Matt Wagner
export const personData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Matt Wagner",
  "jobTitle": "Solutions Architect & Founder",
  "worksFor": {
    "@type": "Organization",
    "name": "Panoramic Solutions"
  },
  "image": "https://panoramic-solutions.com/images/Wagner_Headshot_2024.webp",
  "url": "https://panoramic-solutions.com/about",
  "sameAs": [
    "https://www.linkedin.com/in/matt-wagner33/"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Virginia Tech"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Project Management Professional (PMP)",
      "credentialCategory": "certification"
    },
    {
      "@type": "EducationalOccupationalCredential", 
      "name": "Certified SAFe 6 Agilist",
      "credentialCategory": "certification"
    }
  ],
  "knowsAbout": [
    "SaaS Architecture",
    "Project Portfolio Management", 
    "Enterprise Automations",
    "Digital Transformation",
    "Business Process Optimization"
  ]
}

// Website structured data
export const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Panoramic Solutions",
  "description": "Professional software development, SaaS architecture, and project management services",
  "url": "https://panoramic-solutions.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://panoramic-solutions.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

// Service structured data
export const servicesData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Project Portfolio Management Consulting",
  "description": "Comprehensive PPM consulting services including tool selection, implementation, and optimization",
  "provider": {
    "@type": "Organization",
    "name": "Panoramic Solutions"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "PPM Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "PPM Tool Assessment",
          "description": "Free personalized project management tool recommendations"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "SaaS Architecture Consulting",
          "description": "Custom software architecture and development services"
        }
      }
    ]
  }
}
