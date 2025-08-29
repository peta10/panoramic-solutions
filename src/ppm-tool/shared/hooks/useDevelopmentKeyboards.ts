import { useEffect } from 'react';
import { resetToHomeState } from '@/ppm-tool/shared/utils/homeState';

interface DevelopmentKeyboardsConfig {
  onTriggerProductBumper?: () => void;
  onTriggerExitIntentBumper?: () => void;
  onResetState?: () => void;
  enabled?: boolean;
}

/**
 * Development hook for keyboard shortcuts to test bumpers
 * Ctrl+Shift+Q - Trigger ProductBumper
 * Ctrl+Shift+X - Trigger ExitIntentBumper (changed from E to avoid browser conflicts)
 * Ctrl+Shift+R - Reset All States (Home + Bumper)
 * 
 * Note: Home state shortcuts are separate (Ctrl+Shift+H/T/O)
 */
export const useDevelopmentKeyboards = ({
  onTriggerProductBumper,
  onTriggerExitIntentBumper,
  onResetState,
  enabled = true
}: DevelopmentKeyboardsConfig) => {
  useEffect(() => {
    // Only enable in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    if (!enabled || !isDevelopment) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift combinations
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'q':
            event.preventDefault();
            console.log('🔥 Development Keyboard: Triggering ProductBumper (Ctrl+Shift+Q)');
            onTriggerProductBumper?.();
            break;
          
          case 'x':
            event.preventDefault();
            console.log('🔥 Development Keyboard: Triggering ExitIntentBumper (Ctrl+Shift+X)');
            onTriggerExitIntentBumper?.();
            break;
          
          case 'r':
            event.preventDefault();
            console.log('🔥 Development Keyboard: Resetting All States (Ctrl+Shift+R)');
            // Reset home state first
            resetToHomeState();
            // Then reset bumper states
            onResetState?.();
            console.log('✅ Reset Complete: Home state and bumper states reset');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Log available shortcuts in development
    console.log('🎹 Bumper Development Keyboard Shortcuts Enabled:');
    console.log('  Ctrl+Shift+Q - Trigger ProductBumper');
    console.log('  Ctrl+Shift+X - Trigger ExitIntentBumper (X for eXit)');
    console.log('  Ctrl+Shift+R - Reset All States (Home + Bumper)');
    console.log('');
    console.log('🏠 Home State Shortcuts (separate):');
    console.log('  Ctrl+Shift+H - Show home state info');
    console.log('  Ctrl+Shift+T - Reset to home state only');
    console.log('  Ctrl+Shift+O - List open overlays');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onTriggerProductBumper, onTriggerExitIntentBumper, onResetState, enabled]);
};
