import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/ppm-tool/shared/lib/utils"

// Enhanced TooltipProvider with mobile-optimized settings
const TooltipProvider = ({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  // Detect if we're on a touch device
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  
  React.useEffect(() => {
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <TooltipPrimitive.Provider
      delayDuration={isTouchDevice ? 0 : 200}
      skipDelayDuration={isTouchDevice ? 0 : 100}
      disableHoverableContent={isTouchDevice} // Disable hover on touch devices
      {...props}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  
  React.useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={isTouchDevice ? 8 : sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Mobile optimizations
          "origin-[--radix-tooltip-content-transform-origin]",
          // Ensure proper touch interaction on mobile
          "will-change-transform",
          // Better mobile positioning and overflow handling
          isTouchDevice ? "max-w-[90vw] break-words pointer-events-auto" : "max-w-[85vw] break-words pointer-events-auto",
          // Increase z-index on mobile to ensure visibility
          isTouchDevice ? "z-[9999]" : "z-50",
          className
        )}
        avoidCollisions={true}
        collisionPadding={isTouchDevice ? 16 : 8}
        sticky="partial"
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
