/**
 * Product Bumper State Management
 * Handles localStorage persistence and state utilities for the product bumper
 */

export interface ProductBumperState {
  dismissed: boolean;
  dismissedAt: string;
  showCount: number;
  initialTimerComplete?: boolean;
  mouseMovementDetected?: boolean;
  lastMouseMovementAt?: string;
}

const STORAGE_KEY = 'productBumperState';
const DISMISS_DURATION_DAYS = 30; // Allow re-showing after 30 days
const INITIAL_TIMER_MS = 23000; // 23 second initial timer
const MOUSE_MOVEMENT_TIMER_MS = 3000; // 3 second mouse movement timer

/**
 * Get the current product bumper state from localStorage
 */
export function getProductBumperState(): ProductBumperState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        dismissed: false,
        dismissedAt: '',
        showCount: 0,
        initialTimerComplete: false,
        mouseMovementDetected: false,
        lastMouseMovementAt: ''
      };
    }

    const state: ProductBumperState = JSON.parse(stored);
    
    // Check if enough time has passed to allow re-showing
    if (state.dismissed && state.dismissedAt) {
      const dismissedDate = new Date(state.dismissedAt);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissed >= DISMISS_DURATION_DAYS) {
        // Reset dismissed state after 30 days
        return {
          ...state,
          dismissed: false,
          dismissedAt: '',
          initialTimerComplete: false,
          mouseMovementDetected: false,
          lastMouseMovementAt: ''
        };
      }
    }
    
    return state;
  } catch (error) {
    console.error('Error reading product bumper state:', error);
    return {
      dismissed: false,
      dismissedAt: '',
      showCount: 0,
      initialTimerComplete: false,
      mouseMovementDetected: false,
      lastMouseMovementAt: ''
    };
  }
}

/**
 * Save the product bumper state to localStorage
 */
export function saveProductBumperState(state: ProductBumperState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving product bumper state:', error);
  }
}

/**
 * Mark the product bumper as dismissed
 */
export function dismissProductBumper(): void {
  const currentState = getProductBumperState();
  const newState: ProductBumperState = {
    ...currentState,
    dismissed: true,
    dismissedAt: new Date().toISOString()
  };
  saveProductBumperState(newState);
}

/**
 * Increment the show count for analytics
 */
export function incrementShowCount(): void {
  const currentState = getProductBumperState();
  const newState: ProductBumperState = {
    ...currentState,
    showCount: currentState.showCount + 1
  };
  saveProductBumperState(newState);
}

/**
 * Mark the initial timer as complete
 */
export function markInitialTimerComplete(): void {
  const currentState = getProductBumperState();
  const newState: ProductBumperState = {
    ...currentState,
    initialTimerComplete: true
  };
  saveProductBumperState(newState);
}

/**
 * Record mouse movement detection
 */
export function recordMouseMovement(): void {
  const currentState = getProductBumperState();
  const newState: ProductBumperState = {
    ...currentState,
    mouseMovementDetected: true,
    lastMouseMovementAt: new Date().toISOString()
  };
  saveProductBumperState(newState);
}

/**
 * Check if we're in development mode
 */
function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' || 
         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
}

/**
 * Check if the product bumper should be shown
 */
export function shouldShowProductBumper(): boolean {
  const state = getProductBumperState();
  
  // In development mode, ignore dismissed state to always allow testing
  if (!isDevelopmentMode()) {
    // Don't show if user has dismissed it (and not enough time has passed)
    if (state.dismissed) {
      return false;
    }
  }
  
  // Check if initial timer is complete
  if (!state.initialTimerComplete) {
    return false;
  }
  
  // Check if mouse movement detected and enough time has passed
  if (state.mouseMovementDetected && state.lastMouseMovementAt) {
    const lastMovement = new Date(state.lastMouseMovementAt);
    const timeSinceLastMovement = Date.now() - lastMovement.getTime();
    
    // Show after 3 seconds of mouse movement
    return timeSinceLastMovement >= MOUSE_MOVEMENT_TIMER_MS;
  }
  
  return false;
}

/**
 * Get timing constants for external use
 */
export function getTimingConstants() {
  return {
    INITIAL_TIMER_MS,
    MOUSE_MOVEMENT_TIMER_MS
  };
}

/**
 * Reset the product bumper state (for testing/debugging)
 */
export function resetProductBumperState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Product bumper state reset - should show again now');
  } catch (error) {
    console.error('Error resetting product bumper state:', error);
  }
}

// Manual localStorage clear for debugging
export function forceResetProductBumper(): void {
  try {
    // Check current state
    const currentState = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 Current localStorage state:', currentState);
    
    // Force remove
    localStorage.removeItem(STORAGE_KEY);
    
    // Verify removal
    const afterState = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 After removal state:', afterState);
    
    // Check new state
    const newState = getProductBumperState();
    console.log('🔍 New getProductBumperState():', newState);
    
    console.log('✅ FORCE RESET COMPLETE - ProductBumper should show again');
  } catch (error) {
    console.error('❌ Error in force reset:', error);
  }
}

// Make reset function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).resetProductBumperState = resetProductBumperState;
  (window as any).forceResetProductBumper = forceResetProductBumper;
  (window as any).getProductBumperState = getProductBumperState;
  console.log('🔧 ProductBumper debugging functions available globally');
}