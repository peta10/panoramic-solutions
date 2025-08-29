# Panoramic Solutions Website

A modern, high-performance Next.js website for Panoramic Solutions, a Utah-based consultancy specializing in SaaS Architecture, Enterprise Automations, and Project Portfolio Management. Features an integrated PPM Tool Finder application with advanced state management and interactive workflows.

## 🏔️ Features

- **Modern Stack**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Smooth Animations**: Framer Motion with Lenis smooth scrolling
- **Component Library**: Shadcn/ui components with custom brand styling
- **Database Integration**: Supabase for contact forms, analytics, and data management
- **SEO Optimized**: Dynamic meta tags, structured data, OpenGraph, sitemap generation
- **Accessibility**: WCAG AA compliant with full keyboard navigation
- **Performance**: Lighthouse score ≥95 across all metrics, optimized Core Web Vitals
- **Mobile-First**: Responsive design for all viewport sizes
- **PPM Tool Integration**: Advanced project management tool finder with 15+ criteria
- **Email Integration**: Automated reporting with React Email templates
- **Analytics**: PostHog integration for user behavior tracking
- **Admin Dashboard**: Comprehensive admin interface for content management

## 🎨 Design System

### Brand Colors
- **Midnight**: `#0B1E2D` - Primary dark, main text
- **Alpine Blue**: `#0057B7` - Primary brand color, CTAs
- **Summit Green**: `#2E8B57` - Secondary brand, accents
- **Snow White**: `#F5F9FC` - Light backgrounds, cards

### Typography
- **Font**: Inter variable weight
- **Headings**: Semibold (font-semibold)
- **Body**: Regular (font-normal)
- **Line Height**: 150% for body, 120% for headings

### Component System
- Consistent 8px spacing system
- Hover animations (btn-hover-lift, card-tilt)
- Mobile-first responsive design
- Minimum 48px touch targets
- Semantic HTML with proper ARIA labels

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (for database features)

### Installation

```bash
# Clone the repository
git clone https://github.com/panoramic-solutions/panoramic-solutions.git
cd panoramic-solutions

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Generate sitemap
npm run generate-sitemap
```

## 📁 Project Structure

```
panoramic-solutions/
├── .env                            # Environment variables (not in repo)
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── components.json                 # Shadcn/ui configuration
├── index.html                      # Main HTML template
├── netlify.toml                    # Netlify deployment configuration
├── next.config.js                  # Next.js configuration with optimizations
├── next-env.d.ts                   # Next.js TypeScript declarations
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── postcss.config.js               # PostCSS configuration
├── README.md                       # Project documentation
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
│
├── content/                        # MDX content files
│   └── case-studies/
│       └── techcorp-portfolio-transformation.mdx
│
├── Docs/                           # Documentation files
│   └── Matt Wagner, PMP.txt        # Matt's professional bio
│
├── public/                         # Static assets
│   ├── images/
│   │   ├── Logo_Panoramic_Solutions.webp
│   │   ├── Logo_Transparent.webp
│   │   ├── Wagner_Headshot_2024.webp
│   │   ├── matt-about-pic.webp
│   │   ├── mountain-silhouette.svg
│   │   ├── PPM_Tool_Finder.png
│   │   └── utahmountains (1).webp
│   └── clear-cache.js              # Client-side cache management
│
├── src/                            # Source code
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── page.tsx               # Home page
│   │   ├── globals.css            # Global styles and Tailwind imports
│   │   ├── loading.tsx            # Global loading component
│   │   ├── not-found.tsx          # 404 page
│   │   ├── error.tsx              # Error boundary
│   │   ├── robots.ts              # SEO robots configuration
│   │   ├── sitemap.ts             # Dynamic sitemap generation
│   │   │
│   │   ├── about/                 # About page
│   │   ├── contact/               # Contact page with form
│   │   ├── offerings/             # Services and offerings
│   │   ├── ppm-tool/              # PPM Tool Finder main page
│   │   ├── ppm-tool-embed/        # Embeddable PPM tool version
│   │   │
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── components/        # Admin-specific components
│   │   │   └── page.tsx           # Admin interface
│   │   │
│   │   └── api/                   # API routes
│   │       ├── contact-form-submit/ # Contact form handler
│   │       ├── send-email/        # Email sending service
│   │       ├── generate-chart-image/ # Chart image generation
│   │       ├── analytics/         # Analytics tracking
│   │       └── webhooks/          # Webhook handlers
│   │
│   ├── components/                 # Shared components
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx         # Main navigation
│   │   │   └── Footer.tsx         # Site footer
│   │   │
│   │   ├── email/                 # Email templates
│   │   │   └── PPMReportEmailTemplate.tsx
│   │   │
│   │   ├── providers/             # Context providers
│   │   │   ├── ClientProviders.tsx # Client-side providers
│   │   │   └── ScrollToTop.tsx    # Scroll management
│   │   │
│   │   ├── seo/                   # SEO components
│   │   │   └── StructuredData.tsx # JSON-LD structured data
│   │   │
│   │   └── ui/                    # Shadcn/ui components
│   │       ├── button.tsx         # Button variants
│   │       ├── card.tsx           # Card layouts
│   │       ├── input.tsx          # Form inputs
│   │       ├── toast.tsx          # Notifications
│   │       └── tooltip.tsx        # Interactive tooltips
│   │
│   ├── features/                   # Feature-specific components
│   │   ├── hero/                  # Homepage hero section
│   │   ├── offerings/             # Services presentation
│   │   ├── testimonials/          # Client testimonials
│   │   └── ppm-integration/       # PPM tool integration
│   │
│   ├── ppm-tool/                  # PPM Tool Finder Application
│   │   ├── app/                   # PPM tool pages
│   │   │   ├── layout.tsx         # PPM tool layout
│   │   │   ├── page.tsx           # Main tool interface
│   │   │   └── admin/             # PPM tool admin
│   │   │
│   │   ├── components/            # PPM tool components
│   │   │   ├── animations/        # Animation components
│   │   │   ├── auth/              # Authentication
│   │   │   ├── cards/             # Tool display cards
│   │   │   ├── charts/            # Data visualization
│   │   │   ├── common/            # Shared components
│   │   │   ├── filters/           # Filtering system
│   │   │   ├── forms/             # Interactive forms
│   │   │   ├── interactive/       # User interactions
│   │   │   ├── layout/            # Layout components
│   │   │   ├── overlays/          # Modal overlays
│   │   │   └── ui/                # UI components
│   │   │
│   │   ├── data/                  # PPM tool data
│   │   │   ├── tools.ts           # Tool definitions
│   │   │   ├── criteria.ts        # Evaluation criteria
│   │   │   └── criteriaDescriptions.ts # Criteria explanations
│   │   │
│   │   ├── features/              # PPM tool features
│   │   │   ├── admin/             # Admin functionality
│   │   │   ├── comparison/        # Tool comparison
│   │   │   ├── criteria/          # Criteria management
│   │   │   ├── recommendations/   # Recommendation engine
│   │   │   └── tools/             # Tool management
│   │   │
│   │   └── shared/                # Shared PPM utilities
│   │       ├── contexts/          # React contexts
│   │       ├── hooks/             # Custom hooks
│   │       ├── services/          # Business logic
│   │       ├── types/             # TypeScript definitions
│   │       └── utils/             # Utility functions
│   │           ├── homeState.ts   # Home state management
│   │           └── unifiedBumperState.ts # Bumper system
│   │
│   ├── shared/                     # Application-wide shared code
│   │   ├── hooks/                 # Reusable hooks
│   │   ├── types/                 # TypeScript definitions
│   │   └── utils/                 # Utility functions
│   │       ├── cn.ts              # Class name utilities
│   │       ├── motion.ts          # Animation presets
│   │       └── seo.ts             # SEO utilities
│   │
│   ├── lib/                       # Core libraries
│   │   ├── posthog.ts             # Analytics configuration
│   │   └── supabase.ts            # Database client
│   │
│   ├── instrumentation.ts          # Next.js instrumentation
│   └── instrumentation-client.ts   # Client-side instrumentation
│
└── supabase/                      # Database configuration
    └── migrations/                # Database schema migrations
        ├── 20250119_email_reports.sql
        ├── 20250709202835_calm_art.sql
        └── 20250709225011_stark_tower.sql
```

## 🗄️ Database Schema

### Contact Submissions Table
```sql
contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### Email Reports Table
```sql
email_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  report_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  report_type text DEFAULT 'ppm_comparison'
)
```

### Row Level Security (RLS)
- **Anonymous users**: Can INSERT contact submissions and email reports
- **Authenticated users**: Can INSERT contact submissions and email reports
- **Admin users**: Can SELECT all data across all tables

## 🎯 Pages Overview

### Home (`/`)
- Hero section with mountain panorama background
- "Why Team Panoramic?" value propositions
- Client testimonials carousel
- Core specialties preview
- Call-to-action sections

### About (`/about`)
- Matt Wagner's professional story
- Professional experience timeline
- Certifications and credentials
- Skills and specialties grid
- Contact information links

### Offerings (`/offerings`)
- Expandable service categories:
  - Project & Portfolio Consulting
  - Business Applications
  - Development & Integration Services
- Methodology overview (4-phase process)
- Key benefits for each service

### PPM Tool Finder (`/ppm-tool`)
- **Interactive Assessment**: 15+ evaluation criteria with drag-and-drop ranking
- **Smart Recommendations**: Algorithm-based tool matching and scoring
- **Visual Analytics**: Radar charts and comparison visualizations
- **Email Reports**: Automated PDF generation and delivery
- **Guided Experience**: Progressive disclosure with smart bumpers
- **Admin Dashboard**: Content management and analytics

### PPM Tool Embed (`/ppm-tool-embed`)
- Embeddable version of the PPM tool for external sites
- Iframe-optimized layout and security headers
- Maintains full functionality in embedded context

### Contact (`/contact`)
- Two-column layout with form and sidebar
- Full-featured contact form with validation
- Supabase database integration
- Success page with Calendly integration
- Testimonial sidebar

### Admin Dashboard (`/admin`)
- Contact form submissions management
- Email reports analytics
- User behavior insights
- Content management interface

## 🛠️ Development

### Tech Stack
- **Framework**: Next.js 14 with App Router + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui with custom theming
- **Animations**: Framer Motion + Lenis smooth scrolling
- **Database**: Supabase with PostgreSQL
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js + React Chart.js 2 + HTML5 Canvas
- **Email**: React Email + Resend for transactional emails
- **Analytics**: PostHog for user behavior tracking
- **State Management**: React Context + Custom hooks
- **Icons**: Lucide React

### Code Quality
- ESLint configuration for code standards
- TypeScript strict mode enabled
- Prettier for consistent formatting
- Component-based architecture
- Custom hooks for reusable logic

### Performance Optimizations
- Next.js 14 with App Router for optimal performance
- Server-side rendering and static generation
- Image optimization with Next.js Image component
- Bundle splitting and code splitting
- Tree-shaking and dead code elimination
- Webpack optimizations for chart libraries
- Canvas-based chart rendering for better performance
- Lazy loading for non-critical components
- CSS optimization and minimal bundle size

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://panoramicsolutions.com
NEXT_PUBLIC_SITE_NAME=Panoramic Solutions

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=matt.wagner@panoramic-solutions.com
NEXT_PUBLIC_CONTACT_PHONE=+18015550123

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Optional: OpenAI for future AI features
OPENAI_API_KEY=your_openai_api_key
```

## 🚢 Deployment

### Netlify (Current)
- Automatic deploys from main branch
- Build command: `npm run build`
- Output directory: `.next/`
- Next.js static export configuration
- Environment variables configured in Netlify dashboard

### Vercel (Alternative)
- Optimized for Next.js applications
- Automatic deployments from Git
- Edge functions support
- Built-in analytics and performance monitoring

### Manual Deploy
```bash
# Build for production
npm run build

# Export static files (for Netlify)
npm run export

# Deploy to Netlify
netlify deploy --prod --dir=out
```

## 📊 Features in Detail

### PPM Tool Finder
- **Interactive Assessment**: Drag-and-drop criteria ranking with visual feedback
- **Smart Algorithm**: Weighted scoring system based on user priorities
- **Data Visualization**: Radar charts and comparison matrices using Chart.js
- **Email Integration**: Automated report generation and delivery via Resend
- **State Management**: Advanced home state tracking and bumper system
- **Progressive Disclosure**: Guided experience with contextual help

### Contact Form
- **Frontend**: React Hook Form with Zod validation
- **Backend**: Supabase with RLS policies
- **Security**: Anonymous submissions allowed, admin-only viewing
- **Success Flow**: Confirmation page with Calendly integration

### Email System
- **Templates**: React Email components for consistent branding
- **PDF Generation**: Server-side chart rendering for email attachments
- **Delivery**: Resend integration for reliable email delivery
- **Analytics**: Email open and click tracking

### Animations
- **Scroll**: Lenis smooth scrolling with performance optimization
- **Page Transitions**: Framer Motion with reduced motion support
- **Interactive Elements**: Drag-and-drop with @dnd-kit
- **Loading States**: Skeleton screens and progressive loading

### Responsive Design
- **Mobile-First**: Tailwind CSS breakpoints with mobile optimization
- **Touch Targets**: Minimum 48px for accessibility compliance
- **Typography**: Fluid scaling across devices with Inter font
- **Images**: Next.js Image optimization with WebP/AVIF support

### SEO & Performance
- **Meta Tags**: Dynamic per-page optimization with structured data
- **Sitemap**: Automated generation with next-sitemap
- **OpenGraph**: Social media sharing optimization
- **Lighthouse**: 95+ scores across all metrics
- **Core Web Vitals**: Optimized for Google ranking factors

## 🔄 Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm run start

# Generate sitemap
npm run generate-sitemap
```

### Database Changes
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Contact form submits successfully
- [ ] PPM tool assessment workflow works end-to-end
- [ ] Email reports generate and send correctly
- [ ] Drag-and-drop functionality works on mobile
- [ ] Responsive design works on all devices
- [ ] Animations are smooth and performant
- [ ] All external links work correctly
- [ ] SEO meta tags are present
- [ ] Accessibility standards met
- [ ] Admin dashboard functions properly

### Performance Testing
- [ ] Lighthouse scores ≥95
- [ ] Core Web Vitals pass
- [ ] Mobile performance optimized
- [ ] Bundle size minimized
- [ ] Chart rendering performance acceptable
- [ ] Email generation speed optimal

## 🤝 Contributing

### Code Standards
- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Maintain mobile-first responsive design
- Keep components focused and reusable
- Write semantic HTML with proper ARIA labels
- Use proper state management patterns
- Follow the established folder structure

### Commit Messages
- Use conventional commits format
- Include scope when relevant (feat, fix, docs, style, refactor)
- Reference issue numbers when applicable
- Keep commits focused and atomic

## 📞 Support

For questions or issues:
- **Email**: matt.wagner@panoramic-solutions.com
- **Phone**: (801) 555-0123
- **LinkedIn**: [Matt Wagner](https://www.linkedin.com/in/matt-wagner33/)
- **Schedule**: [Book a Call](https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt)

## 📜 License

© 2025 Panoramic Solutions. All rights reserved.

---

## 🔧 PPM Tool Architecture

### Core Features
The PPM Tool Finder is a sophisticated application built into the Panoramic Solutions website, featuring:

#### Interactive Assessment System
- **15+ Evaluation Criteria**: Comprehensive assessment covering functionality, usability, integration capabilities
- **Drag-and-Drop Interface**: Intuitive ranking system using @dnd-kit for smooth interactions
- **Real-time Scoring**: Dynamic algorithm that updates recommendations as users rank criteria
- **Progressive Disclosure**: Guided experience with contextual help and smart bumpers

#### State Management
- **Home State Tracking**: Advanced system to track user progress and overlay states
- **Bumper System**: Smart notifications and guidance based on user behavior
- **Unified State**: Centralized state management for consistent user experience
- **Development Tools**: Keyboard shortcuts for debugging (Ctrl+Shift+H, T, O)

#### Data Visualization
- **Radar Charts**: Multi-dimensional tool comparison using Chart.js
- **Comparison Matrices**: Side-by-side tool analysis
- **Interactive Charts**: Hover effects and dynamic data display
- **Export Capabilities**: Chart images for email reports and sharing

#### Email Integration
- **React Email Templates**: Professional, branded email layouts
- **Automated Reports**: PDF generation with embedded charts
- **Resend Integration**: Reliable email delivery service
- **Analytics Tracking**: Email open rates and engagement metrics

#### Admin Dashboard
- **Contact Management**: View and manage form submissions
- **Email Analytics**: Track report generation and delivery
- **User Behavior**: Insights into tool usage patterns
- **Content Management**: Update tool data and criteria

### Technical Implementation
- **Next.js App Router**: Modern routing with server components
- **TypeScript**: Full type safety across the application
- **Canvas Rendering**: Server-side chart generation for email attachments
- **Responsive Design**: Mobile-first approach with touch-optimized interactions
- **Performance Optimization**: Bundle splitting and lazy loading

---

**Built with ❤️ in Salt Lake City, Utah**