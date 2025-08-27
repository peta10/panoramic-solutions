'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface OfferingCardProps {
  icon: React.ElementType
  title: string
  excerpt: string
  className?: string
  showLearnMore?: boolean
}

export function OfferingCard({
  icon: Icon,
  title,
  excerpt,
  className = '',
  showLearnMore = true,
}: OfferingCardProps) {
  return (
    <div className={className}>
      <Card className="h-full bg-white border border-midnight/10 shadow-lg min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]">
        <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-start space-x-3">
              <div className="p-2 sm:p-3 rounded-lg bg-alpine/15 flex-shrink-0">
                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-alpine" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-midnight leading-tight">{title}</h3>
            </div>
            
            <p className="text-midnight/70 leading-relaxed text-sm sm:text-base flex-1">{excerpt}</p>
            
            {showLearnMore && (
              <Button 
                asChild
                variant="ghost" 
                className="text-alpine p-0 h-auto text-sm sm:text-base"
              >
                <Link href="/offerings">
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