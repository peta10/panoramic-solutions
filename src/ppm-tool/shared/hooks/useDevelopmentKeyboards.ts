import { useEffect } from 'react';

interface DevelopmentKeyboardsConfig {
  onTriggerProductBumper?: () => void;
  onTriggerExitIntentBumper?: () => void;
  onResetState?: () => void;
  enabled?: boolean;
}

/**
 * Development hook for keyboard shortcuts to test bumpers
 * Ctrl+Shift+Q - Trigger ProductBumper
 * Ctrl+Shift+E - Trigger ExitIntentBumper
 * Ctrl+Shift+R - Reset State
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
          
          case 'e':
            event.preventDefault();
            console.log('🔥 Development Keyboard: Triggering ExitIntentBumper (Ctrl+Shift+E)');
            onTriggerExitIntentBumper?.();
            break;
          
          case 'r':
            event.preventDefault();
            console.log('🔥 Development Keyboard: Resetting State (Ctrl+Shift+R)');
            onResetState?.();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Log available shortcuts in development
    console.log('🎹 Development Keyboard Shortcuts Enabled:');
    console.log('  Ctrl+Shift+Q - Trigger ProductBumper');
    console.log('  Ctrl+Shift+E - Trigger ExitIntentBumper');
    console.log('  Ctrl+Shift+R - Reset State');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onTriggerProductBumper, onTriggerExitIntentBumper, onResetState, enabled]);
};
