import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Panoramic Solutions',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl font-bold text-alpine mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-midnight mb-4">
          Page Not Found
        </h1>
        
        <p className="text-midnight/70 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          The page may have been moved or no longer exists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-alpine hover:bg-summit">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/services">
              <Search className="mr-2 h-4 w-4" />
              Our Services
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
