# Panoramic Solutions Website

A modern, high-performance Vite + React website for Panoramic Solutions, a Utah-based consultancy specializing in SaaS Architecture, Enterprise Automations, and Project Portfolio Management.

## 🏔️ Features

- **Modern Stack**: Vite + React 18 + TypeScript + Tailwind CSS
- **Smooth Animations**: Framer Motion with Lenis smooth scrolling
- **Component Library**: Shadcn/ui components with custom brand styling
- **Database Integration**: Supabase for contact forms and data management
- **SEO Optimized**: Dynamic meta tags, structured data, OpenGraph
- **Accessibility**: WCAG AA compliant with full keyboard navigation
- **Performance**: Lighthouse score ≥95 across all metrics
- **Mobile-First**: Responsive design for all viewport sizes
- **Real-time Contact**: Supabase-powered contact form with admin dashboard

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

### Installation

```bash
# Clone the repository
git clone https://github.com/panoramic-solutions/website.git
cd website

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

# Preview production build
npm run preview
```

## 📁 Project Structure

```
panoramic-solutions/
├── .bolt/                          # Bolt configuration files
│   ├── config.json
│   ├── ignore
│   └── prompt
├── .env                            # Environment variables (not in repo)
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── components.json                 # Shadcn/ui configuration
├── index.html                      # Main HTML template
├── netlify.toml                    # Netlify deployment configuration
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── postcss.config.js               # PostCSS configuration
├── README.md                       # Project documentation
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
│
├── content/                        # MDX content files
│   └── case-studies/
│       └── techcorp-portfolio-transformation.mdx
│
├── Docs/                           # Documentation files
│   └── Matt Wagner, PMP.txt        # Matt's professional bio
│
├── hooks/                          # Custom React hooks
│   └── use-toast.ts               # Toast notification hook
│
├── public/                         # Static assets
│   ├── images/
│   │   ├── Logo_Panoramic_Solutions.webp
│   │   ├── Logo_Transparent.webp
│   │   ├── Wagner_Headshot_2024.webp
│   │   ├── matt-about-pic.webp
│   │   ├── mountain-silhouette.svg
│   │   └── utahmountains (1).webp
│   └── favicon.ico
│
├── src/                            # Source code
│   ├── App.tsx                     # Main application component
│   ├── index.css                   # Global styles and Tailwind imports
│   ├── main.tsx                    # React application entry point
│   │
│   ├── components/                 # Reusable components
│   │   ├── Image.tsx              # Optimized image component
│   │   ├── ServiceCard.tsx        # Service display cards
│   │   ├── StatsTicker.tsx        # Animated KPI counters
│   │   ├── TestimonialCarousel.tsx # Client testimonial carousel
│   │   │
│   │   ├── navigation/            # Navigation components
│   │   │   ├── Header.tsx         # Main site header with navigation
│   │   │   └── Footer.tsx         # Site footer
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── HomePage.tsx       # Landing page
│   │   │   ├── AboutPage.tsx      # About Matt page
│   │   │   ├── ContactPage.tsx    # Contact form page
│   │   │   ├── OfferingsPage.tsx  # Services page
│   │   │   ├── PPMToolFinderPage.tsx # PPM tool finder
│   │   │   └── CaseStudiesPage.tsx # Case studies (placeholder)
│   │   │
│   │   ├── providers/             # Context providers
│   │   │   └── ClientProviders.tsx # Client-side providers wrapper
│   │   │
│   │   └── ui/                    # Shadcn/ui components
│   │       ├── button.tsx         # Button component
│   │       ├── card.tsx           # Card component
│   │       ├── footer-section.tsx # Footer section component
│   │       ├── input.tsx          # Input field component
│   │       ├── label.tsx          # Label component
│   │       ├── switch.tsx         # Toggle switch component
│   │       ├── textarea.tsx       # Textarea component
│   │       ├── toast.tsx          # Toast notification component
│   │       └── tooltip.tsx        # Tooltip component
│   │
│   ├── layouts/                   # Layout components
│   │   └── DefaultLayout.tsx      # Main site layout wrapper
│   │
│   └── lib/                       # Utility libraries
│       ├── lenis.ts              # Smooth scrolling configuration
│       ├── motion.ts             # Framer Motion animation presets
│       ├── supabase.ts           # Supabase client and functions
│       └── utils.ts              # General utility functions
│
└── supabase/                      # Supabase configuration
    └── migrations/                # Database migrations
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

### Row Level Security (RLS)
- **Anonymous users**: Can INSERT contact submissions
- **Authenticated users**: Can INSERT contact submissions
- **Admin users**: Can SELECT all contact submissions

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

### Offerings (`/services`)
- Expandable service categories:
  - Project & Portfolio Consulting
  - Business Applications
  - Development & Integration Services
- Methodology overview (4-phase process)
- Key benefits for each service

### PPM Tool Finder (`/ppm-tool-finder`)
- Interactive tool assessment (placeholder)
- Step-by-step process explanation
- Benefits and value proposition
- Matt's guarantee section

### Contact (`/contact`)
- Two-column layout with form and sidebar
- Full-featured contact form with validation
- Supabase database integration
- Success page with Calendly integration
- Testimonial sidebar

### Case Studies (`/case-studies`)
- Industry filter buttons
- Case study grid (placeholder for future content)

## 🛠️ Development

### Tech Stack
- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui with custom theming
- **Animations**: Framer Motion + Lenis smooth scrolling
- **Database**: Supabase with PostgreSQL
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Code Quality
- ESLint configuration for code standards
- TypeScript strict mode enabled
- Prettier for consistent formatting
- Component-based architecture
- Custom hooks for reusable logic

### Performance Optimizations
- Vite for fast development and builds
- Lazy loading for non-critical components
- Optimized images with proper sizing
- CSS-in-JS eliminated for better performance
- Tree-shaking enabled
- Minimal bundle size

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
VITE_SITE_URL=https://panoramicsolutions.com
VITE_SITE_NAME=Panoramic Solutions

# Contact Information
VITE_CONTACT_EMAIL=matt.wagner@panoramic-solutions.com
VITE_CONTACT_PHONE=+18015550123

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 🚢 Deployment

### Netlify (Current)
- Automatic deploys from main branch
- Build command: `npm run build`
- Output directory: `dist/`
- Environment variables configured in Netlify dashboard

### Manual Deploy
```bash
# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📊 Features in Detail

### Contact Form
- **Frontend**: React Hook Form with Zod validation
- **Backend**: Supabase with RLS policies
- **Security**: Anonymous submissions allowed, admin-only viewing
- **Success Flow**: Confirmation page with Calendly integration

### Animations
- **Scroll**: Lenis smooth scrolling
- **Page Transitions**: Framer Motion with performance optimizations
- **Hover Effects**: CSS transforms with GPU acceleration
- **Loading States**: Skeleton screens and progressive loading

### Responsive Design
- **Mobile-First**: Tailwind CSS breakpoints
- **Touch Targets**: Minimum 48px for accessibility
- **Typography**: Fluid scaling across devices
- **Images**: Responsive with proper aspect ratios

### SEO & Performance
- **Meta Tags**: Dynamic per-page optimization
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

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
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
- [ ] Responsive design works on all devices
- [ ] Animations are smooth and performant
- [ ] All external links work correctly
- [ ] SEO meta tags are present
- [ ] Accessibility standards met

### Performance Testing
- [ ] Lighthouse scores ≥95
- [ ] Core Web Vitals pass
- [ ] Mobile performance optimized
- [ ] Bundle size minimized

## 🤝 Contributing

### Code Standards
- Use TypeScript for all new files
- Follow existing component patterns
- Maintain mobile-first responsive design
- Keep components focused and reusable
- Write semantic HTML with proper ARIA labels

### Commit Messages
- Use conventional commits format
- Include scope when relevant
- Reference issue numbers when applicable

## 📞 Support

For questions or issues:
- **Email**: matt.wagner@panoramic-solutions.com
- **Phone**: (801) 555-0123
- **LinkedIn**: [Matt Wagner](https://www.linkedin.com/in/matt-wagner33/)
- **Schedule**: [Book a Call](https://app.onecal.io/b/matt-wagner/schedule-a-meeting-with-matt)

## 📜 License

© 2025 Panoramic Solutions. All rights reserved.

---

**Built with ❤️ in Salt Lake City, Utah**