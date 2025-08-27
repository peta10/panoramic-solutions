/**
 * Exit Intent State Management
 * Handles localStorage persistence and state utilities for exit-intent detection
 * 
 * Behavior:
 * - Shows after 30 seconds on page when user shows exit intent
 * - Dismissed state persists forever (until cache is cleared)
 * - Shows only once per session
 * - Triggers on mouse leave or tab switch
 */

export interface ExitIntentState {
  dismissed: boolean;
  dismissedAt: string;
  showCount: number;
  lastTriggeredAt?: string;
  mouseLeaveTriggered?: boolean;
  tabSwitchTriggered?: boolean;
}

const STORAGE_KEY = 'exitIntentState';
const MIN_TIME_ON_PAGE_MS = 30000; // Minimum 30 seconds before showing
const MAX_SHOWS_PER_SESSION = 1; // Only show once per session

/**
 * Get the current exit intent state from localStorage
 */
export function getExitIntentState(): ExitIntentState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        dismissed: false,
        dismissedAt: '',
        showCount: 0,
        lastTriggeredAt: '',
        mouseLeaveTriggered: false,
        tabSwitchTriggered: false
      };
    }

    const state: ExitIntentState = JSON.parse(stored);
    
    // If dismissed, it stays dismissed forever (until cache is cleared)
    if (state.dismissed) {
      return state; // Return dismissed state as-is
    }
    
    return state;
  } catch (error) {
    console.error('Error reading exit intent state:', error);
    return {
      dismissed: false,
      dismissedAt: '',
      showCount: 0,
      lastTriggeredAt: '',
      mouseLeaveTriggered: false,
      tabSwitchTriggered: false
    };
  }
}

/**
 * Save the exit intent state to localStorage
 */
export function saveExitIntentState(state: ExitIntentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving exit intent state:', error);
  }
}

/**
 * Mark the exit intent as dismissed
 */
export function dismissExitIntent(): void {
  const currentState = getExitIntentState();
  const newState: ExitIntentState = {
    ...currentState,
    dismissed: true,
    dismissedAt: new Date().toISOString()
  };
  saveExitIntentState(newState);
}

/**
 * Increment the show count for analytics
 */
export function incrementExitIntentShowCount(): void {
  const currentState = getExitIntentState();
  const newState: ExitIntentState = {
    ...currentState,
    showCount: currentState.showCount + 1,
    lastTriggeredAt: new Date().toISOString()
  };
  saveExitIntentState(newState);
}

/**
 * Record mouse leave trigger
 */
export function recordMouseLeaveTrigger(): void {
  const currentState = getExitIntentState();
  const newState: ExitIntentState = {
    ...currentState,
    mouseLeaveTriggered: true,
    lastTriggeredAt: new Date().toISOString()
  };
  saveExitIntentState(newState);
}

/**
 * Record tab switch trigger
 */
export function recordTabSwitchTrigger(): void {
  const currentState = getExitIntentState();
  const newState: ExitIntentState = {
    ...currentState,
    tabSwitchTriggered: true,
    lastTriggeredAt: new Date().toISOString()
  };
  saveExitIntentState(newState);
}

/**
 * Check if we're in development mode
 */
function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' || 
         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
}

/**
 * Check if the exit intent should be shown
 */
export function shouldShowExitIntent(): boolean {
  const state = getExitIntentState();
  
  // In development mode, ignore dismissed state to always allow testing
  if (!isDevelopmentMode()) {
    // Don't show if user has dismissed it (and not enough time has passed)
    if (state.dismissed) {
      return false;
    }
  }
  
  // Don't show if already shown this session
  if (state.showCount >= MAX_SHOWS_PER_SESSION) {
    return false;
  }
  
  return true;
}

/**
 * Get timing constants for external use
 */
export function getExitIntentTimingConstants() {
  return {
    MIN_TIME_ON_PAGE_MS,
    MAX_SHOWS_PER_SESSION
  };
}

/**
 * Reset the exit intent state (for testing/debugging)
 */
export function resetExitIntentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Exit intent state reset - should show again now');
  } catch (error) {
    console.error('Error resetting exit intent state:', error);
  }
}

// Make reset function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).resetExitIntentState = resetExitIntentState;
  (window as any).getExitIntentState = getExitIntentState;
  console.log('🔧 ExitIntent debugging functions available globally');
}
