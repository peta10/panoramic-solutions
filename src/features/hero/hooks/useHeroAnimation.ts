'use client'

import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'

export function useHeroAnimation() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  })

  return { 
    ref, 
    isVisible: isIntersecting 
  }
}