'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="text-center max-w-md px-4">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        
        <h2 className="text-2xl font-bold text-midnight mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-midnight/70 mb-6">
          We&apos;re sorry, but something unexpected happened. Please try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-alpine hover:bg-summit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
