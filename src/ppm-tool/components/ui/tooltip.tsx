import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/ppm-tool/shared/lib/utils"
import { useTouchDevice } from "@/ppm-tool/shared/hooks/useTouchDevice"

// Enhanced TooltipProvider with mobile-optimized settings
const TooltipProvider = ({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={100}
      skipDelayDuration={50}
      {...props}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

// Mobile-friendly tooltip that works with click/touch
const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
>(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const isTouchDevice = useTouchDevice();

  // For mobile devices, we control the open state manually
  if (isTouchDevice) {
    return (
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        {children}
      </TooltipPrimitive.Root>
    );
  }

  // For desktop, use normal hover behavior
  return (
    <TooltipPrimitive.Root {...props}>
      {children}
    </TooltipPrimitive.Root>
  );
})

// Mobile-friendly trigger that handles both hover and click
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, onPointerDown, ...props }, ref) => {
  const isTouchDevice = useTouchDevice();

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // For touch devices, let the click trigger the tooltip
    if (isTouchDevice) {
      // Don't prevent default - let Radix handle the click
      event.stopPropagation();
    }
    onClick?.(event);
  }, [isTouchDevice, onClick]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    // For touch devices, ensure we handle touch events properly
    if (isTouchDevice && event.pointerType === 'touch') {
      event.stopPropagation();
    }
    onPointerDown?.(event);
  }, [isTouchDevice, onPointerDown]);

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      // For touch devices, ensure button can be clicked
      style={isTouchDevice ? { 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)'
      } : undefined}
      {...props}
    />
  );
})

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const isTouchDevice = useTouchDevice();

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
        onPointerDownOutside={isTouchDevice ? (e) => {
          // Allow closing tooltip by tapping outside on mobile
          e.preventDefault();
        } : undefined}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
