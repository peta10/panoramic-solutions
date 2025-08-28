"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/ppm-tool/shared/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, onValueChange, ...props }, ref) => {
  // Remove the problematic useCallback and requestAnimationFrame
  // Use the onValueChange directly to prevent ref composition loops
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center cursor-pointer overflow-hidden",
        className,
      )}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gray-200 hover:bg-gray-250 transition-colors duration-150">
        <SliderPrimitive.Range className="absolute h-full bg-alpine-blue-400 transition-none" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block h-6 w-6 rounded-full border-3 border-alpine-blue-400 bg-white shadow-lg ring-offset-background transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpine-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:shadow-xl active:scale-100 cursor-grab active:cursor-grabbing will-change-transform" 
        style={{
          // Cross-browser focus style overrides to prevent yellow highlighting
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        } as React.CSSProperties}
        onFocus={(e) => {
          // Explicitly prevent any browser default focus styles
          e.target.style.outline = 'none';
          e.target.style.boxShadow = 'none';
        }}
        onBlur={(e) => {
          // Reset any potential focus styles
          e.target.style.outline = 'none';
          e.target.style.boxShadow = 'none';
        }}
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 