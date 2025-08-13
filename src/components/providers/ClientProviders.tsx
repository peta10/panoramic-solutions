'use client'

import { ReactNode } from 'react'
import { ScrollToTop } from './ScrollToTop'

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  )
}
