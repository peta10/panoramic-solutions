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
>(({ children, open, onOpenChange, ...props }, ref) => {
  const isTouchDevice = useTouchDevice();
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use controlled state for mobile, uncontrolled for desktop
  const isControlled = open !== undefined;
  const tooltipOpen = isControlled ? open : internalOpen;
  const setTooltipOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <TooltipPrimitive.Root 
      {...props}
      open={tooltipOpen}
      onOpenChange={setTooltipOpen}
      // On mobile, use faster timing for better responsiveness
      delayDuration={isTouchDevice ? 0 : 700}
    >
      {children}
    </TooltipPrimitive.Root>
  );
});
Tooltip.displayName = "Tooltip";

// Mobile-friendly trigger that handles both hover and click
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, asChild, children, className, ...props }, ref) => {
  const isTouchDevice = useTouchDevice();

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // On touch devices, let Radix handle the tooltip toggle naturally
    onClick?.(event);
  }, [onClick]);

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onClick={handleClick}
      asChild={asChild}
      className={cn(
        // Base mobile-friendly touch target styles
        isTouchDevice && !asChild && "min-h-[44px] min-w-[44px] flex items-center justify-center",
        className
      )}
      style={isTouchDevice ? { 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.1)',
      } : undefined}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const isTouchDevice = useTouchDevice();

  // Auto-close tooltip on mobile after 4 seconds
  React.useEffect(() => {
    if (!isTouchDevice) return;

    const timer = setTimeout(() => {
      // Close any open tooltips by triggering a tap outside
      const event = new Event('pointerdown', { bubbles: true });
      document.dispatchEvent(event);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isTouchDevice]);

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
          // On mobile, allow closing tooltip by tapping outside
          // Don't prevent default - just let the tooltip close
        } : undefined}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Higher-level component that provides a complete mobile-friendly tooltip
interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

const SimpleTooltip = ({ content, children, side = "top", align = "center", className }: SimpleTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, SimpleTooltip }
