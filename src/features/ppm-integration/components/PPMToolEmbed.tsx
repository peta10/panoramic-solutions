'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PPMToolEmbedProps {
  src?: string
  title?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

const PPMToolEmbed = memo(function PPMToolEmbed({ 
  src = '/ppm-tool',
  title = 'PPM Tool',
  onLoad,
  onError 
}: PPMToolEmbedProps) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Handle iframe loading
  const handleIframeLoad = useCallback(() => {
    setLoadingState('loaded')
    setLoadingProgress(100)
    onLoad?.()
  }, [onLoad])

  const handleIframeError = useCallback(() => {
    const error = new Error('Failed to load PPM Tool')
    setLoadingState('error')
    onError?.(error)
  }, [onError])

  // Simulate loading progress for better UX
  useEffect(() => {
    if (loadingState === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [loadingState])

  const retry = useCallback(() => {
    setLoadingState('loading')
    setLoadingProgress(0)
    if (iframeRef.current) {
      iframeRef.current.src = src
    }
  }, [src])

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <AnimatePresence mode="wait">
        {loadingState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white"
          >
            <div className="text-center max-w-md px-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <Loader2 className="h-16 w-16 text-alpine mx-auto" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-midnight mb-4">
                Loading PPM Tool Finder
              </h2>
              
              <p className="text-midnight/70 mb-6">
                Preparing your personalized project management solution...
              </p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-alpine to-summit h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="text-sm text-midnight/50">
                {Math.round(loadingProgress)}% Complete
              </p>
            </div>
          </motion.div>
        )}

        {loadingState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white"
          >
            <div className="text-center max-w-md px-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              
              <h2 className="text-2xl font-bold text-midnight mb-4">
                Unable to Load PPM Tool
              </h2>
              
              <p className="text-midnight/70 mb-6">
                We're experiencing technical difficulties. Please try again or contact support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={retry} className="bg-alpine hover:bg-summit">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note: This would normally embed the actual PPM Tool */}
      <div className={`w-full h-full transition-opacity duration-300 ${
        loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-center h-full bg-white">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-midnight mb-4">PPM Tool Finder</h2>
            <p className="text-midnight/70 mb-6">
              This is where the actual PPM Tool would be embedded. 
              <br />The infrastructure is ready for seamless integration.
            </p>
            <Button 
              onClick={() => {
                setLoadingState('loaded')
                handleIframeLoad()
              }}
              className="bg-alpine hover:bg-summit"
            >
              Simulate Tool Load
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export { PPMToolEmbed }
