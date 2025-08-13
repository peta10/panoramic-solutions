'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ServiceCardProps {
  icon: React.ElementType
  title: string
  excerpt: string
  className?: string
  showLearnMore?: boolean
}

export function ServiceCard({
  icon: Icon,
  title,
  excerpt,
  className = '',
  showLearnMore = true,
}: ServiceCardProps) {
  return (
    <div className={className}>
      <Card className="h-full bg-white border border-midnight/10 shadow-lg hover-lift">
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 sm:p-3 rounded-lg bg-alpine/15 flex-shrink-0">
                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-alpine" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-midnight leading-tight">{title}</h3>
            </div>
            
            <p className="text-midnight/70 leading-relaxed text-sm sm:text-base">{excerpt}</p>
            
            {showLearnMore && (
              <Button 
                asChild
                variant="ghost" 
                className="text-alpine hover:text-summit transition-colors p-0 h-auto text-sm sm:text-base"
              >
                <Link href="/services">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}