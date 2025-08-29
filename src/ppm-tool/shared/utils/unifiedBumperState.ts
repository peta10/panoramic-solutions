/**
 * Unified Bumper State Management
 * Handles all timing and coordination logic for ProductBumper and ExitIntentBumper
 * 
 * Requirements:
 * 1. Never show bumper if already open, Guided Rankings open, or Comparison Report open
 * 2. When user exits Guided Rankings: wait 23s + 3s after mouse stops, only if not shown before and user hasn't clicked into Guided Rankings
 * 3. When user exits Comparison Report: wait 23s + 3s after mouse stops, only if not shown before and user hasn't clicked into Guided Rankings, do not show again after this
 * 4. When user opens tool but doesn't engage: if no GR or CR opened, wait 23s + 3s after mouse stops
 * 5. After ProductBumper closed: do not show again
 * 6. After ExitIntentBumper closed: do not show again until 23s has passed
 * 7. Exit-Intent: Show 2 minutes after opening tool or when leaving, but only if user hasn't clicked into Guided Rankings
 */

export interface UnifiedBumperState {
  // Core state tracking
  hasClickedIntoGuidedRankings: boolean;
  hasClickedIntoComparisonReport: boolean;
  
  // Product bumper state
  productBumperShown: boolean;
  productBumperDismissed: boolean;
  productBumperDismissedAt?: string;
  
  // Exit intent state
  exitIntentShown: boolean;
  exitIntentDismissed: boolean;
  exitIntentDismissedAt?: string;
  
  // Session tracking
  guidedRankingsOpenedAt?: string;
  guidedRankingsClosedAt?: string;
  comparisonReportOpenedAt?: string;
  comparisonReportClosedAt?: string;
  toolOpenedAt: string;
  
  // Mouse movement tracking
  lastMouseMovementAt?: string;
  mouseStoppedAt?: string;
  
  // Timing states
  initialTimerComplete: boolean;
  mouseMovementTimerComplete: boolean;
  
  // Current UI state (not persisted)
  isGuidedRankingsCurrentlyOpen?: boolean;
  isComparisonReportCurrentlyOpen?: boolean;
  isAnyBumperCurrentlyOpen?: boolean;
}

const STORAGE_KEY = 'unifiedBumperState';
const INITIAL_TIMER_MS = 23000; // 23 seconds
const MOUSE_MOVEMENT_TIMER_MS = 3000; // 3 seconds after mouse stops
const EXIT_INTENT_TIMER_MS = 120000; // 2 minutes for exit intent
const POST_BUMPER_DELAY_MS = 23000; // 23 seconds after bumper closed

/**
 * Get the current unified bumper state from localStorage
 */
export function getUnifiedBumperState(): UnifiedBumperState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        hasClickedIntoGuidedRankings: false,
        hasClickedIntoComparisonReport: false,
        productBumperShown: false,
        productBumperDismissed: false,
        exitIntentShown: false,
        exitIntentDismissed: false,
        toolOpenedAt: new Date().toISOString(),
        initialTimerComplete: false,
        mouseMovementTimerComplete: false,
        isGuidedRankingsCurrentlyOpen: false,
        isComparisonReportCurrentlyOpen: false,
        isAnyBumperCurrentlyOpen: false
      };
    }
    
    const state: UnifiedBumperState = JSON.parse(stored);
    
    // Always reset current UI state on page load
    state.isGuidedRankingsCurrentlyOpen = false;
    state.isComparisonReportCurrentlyOpen = false;
    state.isAnyBumperCurrentlyOpen = false;
    
    return state;
  } catch (error) {
    console.error('Error reading unified bumper state:', error);
    return {
      hasClickedIntoGuidedRankings: false,
      hasClickedIntoComparisonReport: false,
      productBumperShown: false,
      productBumperDismissed: false,
      exitIntentShown: false,
      exitIntentDismissed: false,
      toolOpenedAt: new Date().toISOString(),
      initialTimerComplete: false,
      mouseMovementTimerComplete: false,
      isGuidedRankingsCurrentlyOpen: false,
      isComparisonReportCurrentlyOpen: false,
      isAnyBumperCurrentlyOpen: false
    };
  }
}

/**
 * Save the unified bumper state to localStorage
 */
export function saveUnifiedBumperState(state: UnifiedBumperState): void {
  try {
    // Don't persist current UI state
    const { 
      isGuidedRankingsCurrentlyOpen, 
      isComparisonReportCurrentlyOpen, 
      isAnyBumperCurrentlyOpen, 
      ...persistedState 
    } = state;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Error saving unified bumper state:', error);
  }
}

/**
 * Record that user clicked into Guided Rankings
 */
export function recordGuidedRankingsClick(): void {
  const state = getUnifiedBumperState();
  state.hasClickedIntoGuidedRankings = true;
  saveUnifiedBumperState(state);
  console.log('🎯 Recorded Guided Rankings click - no more bumpers will show');
}

/**
 * Record that user clicked into Comparison Report
 */
export function recordComparisonReportClick(): void {
  const state = getUnifiedBumperState();
  state.hasClickedIntoComparisonReport = true;
  saveUnifiedBumperState(state);
  console.log('📊 Recorded Comparison Report click');
}

/**
 * Record that Guided Rankings opened
 */
export function recordGuidedRankingsOpened(): void {
  const state = getUnifiedBumperState();
  state.guidedRankingsOpenedAt = new Date().toISOString();
  state.isGuidedRankingsCurrentlyOpen = true;
  saveUnifiedBumperState(state);
  console.log('🔍 Guided Rankings opened');
}

/**
 * Record that Guided Rankings closed
 */
export function recordGuidedRankingsClosed(): void {
  const state = getUnifiedBumperState();
  state.guidedRankingsClosedAt = new Date().toISOString();
  state.isGuidedRankingsCurrentlyOpen = false;
  saveUnifiedBumperState(state);
  console.log('🔍 Guided Rankings closed');
}

/**
 * Record that Comparison Report opened
 */
export function recordComparisonReportOpened(): void {
  const state = getUnifiedBumperState();
  state.comparisonReportOpenedAt = new Date().toISOString();
  state.isComparisonReportCurrentlyOpen = true;
  saveUnifiedBumperState(state);
  console.log('📊 Comparison Report opened');
}

/**
 * Record that Comparison Report closed
 */
export function recordComparisonReportClosed(): void {
  const state = getUnifiedBumperState();
  state.comparisonReportClosedAt = new Date().toISOString();
  state.isComparisonReportCurrentlyOpen = false;
  saveUnifiedBumperState(state);
  console.log('📊 Comparison Report closed');
}

/**
 * Record mouse movement
 */
export function recordMouseMovement(): void {
  const state = getUnifiedBumperState();
  state.lastMouseMovementAt = new Date().toISOString();
  state.mouseStoppedAt = undefined; // Clear mouse stopped timestamp
  state.mouseMovementTimerComplete = false;
  saveUnifiedBumperState(state);
}

/**
 * Record that mouse has stopped moving
 */
export function recordMouseStopped(): void {
  const state = getUnifiedBumperState();
  state.mouseStoppedAt = new Date().toISOString();
  saveUnifiedBumperState(state);
  console.log('🖱️ Mouse stopped moving - starting 3s timer');
}

/**
 * Record that initial timer is complete
 */
export function recordInitialTimerComplete(): void {
  const state = getUnifiedBumperState();
  state.initialTimerComplete = true;
  saveUnifiedBumperState(state);
  console.log('⏱️ Initial 23s timer complete');
}

/**
 * Record that mouse movement timer is complete
 */
export function recordMouseMovementTimerComplete(): void {
  const state = getUnifiedBumperState();
  state.mouseMovementTimerComplete = true;
  saveUnifiedBumperState(state);
  console.log('🖱️ Mouse movement 3s timer complete');
}

/**
 * Record that Product Bumper was shown
 */
export function recordProductBumperShown(): void {
  const state = getUnifiedBumperState();
  state.productBumperShown = true;
  state.isAnyBumperCurrentlyOpen = true;
  saveUnifiedBumperState(state);
  console.log('🎯 Product Bumper shown');
}

/**
 * Record that Product Bumper was dismissed
 */
export function recordProductBumperDismissed(): void {
  const state = getUnifiedBumperState();
  state.productBumperDismissed = true;
  state.productBumperDismissedAt = new Date().toISOString();
  state.isAnyBumperCurrentlyOpen = false;
  saveUnifiedBumperState(state);
  console.log('🎯 Product Bumper dismissed - will not show again');
}

/**
 * Record that Exit Intent Bumper was shown
 */
export function recordExitIntentBumperShown(): void {
  const state = getUnifiedBumperState();
  state.exitIntentShown = true;
  state.isAnyBumperCurrentlyOpen = true;
  saveUnifiedBumperState(state);
  console.log('🚪 Exit Intent Bumper shown');
}

/**
 * Record that Exit Intent Bumper was dismissed
 */
export function recordExitIntentBumperDismissed(): void {
  const state = getUnifiedBumperState();
  state.exitIntentDismissed = true;
  state.exitIntentDismissedAt = new Date().toISOString();
  state.isAnyBumperCurrentlyOpen = false;
  saveUnifiedBumperState(state);
  console.log('🚪 Exit Intent Bumper dismissed');
}

/**
 * Set bumper currently open state
 */
export function setBumperCurrentlyOpen(isOpen: boolean): void {
  const state = getUnifiedBumperState();
  state.isAnyBumperCurrentlyOpen = isOpen;
  // Don't persist this to localStorage as it's UI state
}

/**
 * Check if Product Bumper should be shown
 */
export function shouldShowProductBumper(): boolean {
  const state = getUnifiedBumperState();
  
  // PRIORITY CHECK: Must be in home state to show any bumpers
  const { shouldAllowBumpers } = require('./homeState');
  if (!shouldAllowBumpers()) {
    console.log('⛔ Product Bumper blocked - not in home state');
    return false;
  }
  
  // Never show if user has clicked into Guided Rankings
  if (state.hasClickedIntoGuidedRankings) {
    console.log('⛔ Product Bumper blocked - user clicked into Guided Rankings');
    return false;
  }
  
  // Never show if any bumper is currently open
  if (state.isAnyBumperCurrentlyOpen) {
    console.log('⛔ Product Bumper blocked - another bumper is open');
    return false;
  }
  
  // Never show if Guided Rankings is currently open
  if (state.isGuidedRankingsCurrentlyOpen) {
    console.log('⛔ Product Bumper blocked - Guided Rankings is open');
    return false;
  }
  
  // Never show if Comparison Report is currently open
  if (state.isComparisonReportCurrentlyOpen) {
    console.log('⛔ Product Bumper blocked - Comparison Report is open');
    return false;
  }
  
  // Never show if already dismissed
  if (state.productBumperDismissed) {
    console.log('⛔ Product Bumper blocked - already dismissed');
    return false;
  }
  
  // Never show if already shown
  if (state.productBumperShown) {
    console.log('⛔ Product Bumper blocked - already shown');
    return false;
  }
  
  // Check timing conditions based on scenario
  const now = Date.now();
  const toolOpenedAt = new Date(state.toolOpenedAt).getTime();
  
  // Scenario 1: User exits Guided Rankings
  if (state.guidedRankingsClosedAt && !state.hasClickedIntoGuidedRankings) {
    const guidedClosedAt = new Date(state.guidedRankingsClosedAt).getTime();
    const timeSinceGuidedClosed = now - guidedClosedAt;
    
    // Must wait 23 seconds since Guided Rankings closed
    if (timeSinceGuidedClosed < INITIAL_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 23s after Guided Rankings closed');
      return false;
    }
    
    // Must wait 3 seconds after mouse stopped
    if (!state.mouseStoppedAt) {
      console.log('🖱️ Product Bumper blocked - waiting for mouse to stop');
      return false;
    }
    
    const mouseStoppedAt = new Date(state.mouseStoppedAt).getTime();
    const timeSinceMouseStopped = now - mouseStoppedAt;
    
    if (timeSinceMouseStopped < MOUSE_MOVEMENT_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 3s after mouse stopped');
      return false;
    }
    
    console.log('✅ Product Bumper can show - Guided Rankings exit scenario');
    return true;
  }
  
  // Scenario 2: User exits Comparison Report
  if (state.comparisonReportClosedAt && !state.hasClickedIntoGuidedRankings) {
    const reportClosedAt = new Date(state.comparisonReportClosedAt).getTime();
    const timeSinceReportClosed = now - reportClosedAt;
    
    // Must wait 23 seconds since Comparison Report closed
    if (timeSinceReportClosed < INITIAL_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 23s after Comparison Report closed');
      return false;
    }
    
    // Must wait 3 seconds after mouse stopped
    if (!state.mouseStoppedAt) {
      console.log('🖱️ Product Bumper blocked - waiting for mouse to stop');
      return false;
    }
    
    const mouseStoppedAt = new Date(state.mouseStoppedAt).getTime();
    const timeSinceMouseStopped = now - mouseStoppedAt;
    
    if (timeSinceMouseStopped < MOUSE_MOVEMENT_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 3s after mouse stopped');
      return false;
    }
    
    console.log('✅ Product Bumper can show - Comparison Report exit scenario');
    return true;
  }
  
  // Scenario 3: User opens tool but doesn't engage
  if (!state.guidedRankingsOpenedAt && !state.comparisonReportOpenedAt) {
    const timeSinceToolOpened = now - toolOpenedAt;
    
    // Must wait 23 seconds since tool opened
    if (timeSinceToolOpened < INITIAL_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 23s after tool opened');
      return false;
    }
    
    // Must wait 3 seconds after mouse stopped
    if (!state.mouseStoppedAt) {
      console.log('🖱️ Product Bumper blocked - waiting for mouse to stop');
      return false;
    }
    
    const mouseStoppedAt = new Date(state.mouseStoppedAt).getTime();
    const timeSinceMouseStopped = now - mouseStoppedAt;
    
    if (timeSinceMouseStopped < MOUSE_MOVEMENT_TIMER_MS) {
      console.log('⏱️ Product Bumper blocked - waiting for 3s after mouse stopped');
      return false;
    }
    
    console.log('✅ Product Bumper can show - no engagement scenario');
    return true;
  }
  
  console.log('⛔ Product Bumper blocked - no applicable scenario');
  return false;
}

/**
 * Check if Exit Intent Bumper should be shown
 */
export function shouldShowExitIntentBumper(): boolean {
  const state = getUnifiedBumperState();
  
  // PRIORITY CHECK: Must be in home state to show any bumpers
  const { shouldAllowBumpers } = require('./homeState');
  if (!shouldAllowBumpers()) {
    console.log('⛔ Exit Intent blocked - not in home state');
    return false;
  }
  
  // Never show if user has clicked into Guided Rankings
  if (state.hasClickedIntoGuidedRankings) {
    console.log('⛔ Exit Intent blocked - user clicked into Guided Rankings');
    return false;
  }
  
  // Never show if any bumper is currently open
  if (state.isAnyBumperCurrentlyOpen) {
    console.log('⛔ Exit Intent blocked - another bumper is open');
    return false;
  }
  
  // Never show if Guided Rankings is currently open
  if (state.isGuidedRankingsCurrentlyOpen) {
    console.log('⛔ Exit Intent blocked - Guided Rankings is open');
    return false;
  }
  
  // Never show if Comparison Report is currently open
  if (state.isComparisonReportCurrentlyOpen) {
    console.log('⛔ Exit Intent blocked - Comparison Report is open');
    return false;
  }
  
  // Never show if already shown
  if (state.exitIntentShown) {
    console.log('⛔ Exit Intent blocked - already shown');
    return false;
  }
  
  // Check if enough time has passed since dismissal (23 seconds)
  if (state.exitIntentDismissed && state.exitIntentDismissedAt) {
    const dismissedAt = new Date(state.exitIntentDismissedAt).getTime();
    const timeSinceDismissed = Date.now() - dismissedAt;
    
    if (timeSinceDismissed < POST_BUMPER_DELAY_MS) {
      console.log('⏱️ Exit Intent blocked - waiting for 23s after dismissal');
      return false;
    }
  }
  
  // Check minimum time on page (2 minutes)
  const toolOpenedAt = new Date(state.toolOpenedAt).getTime();
  const timeOnPage = Date.now() - toolOpenedAt;
  
  if (timeOnPage < EXIT_INTENT_TIMER_MS) {
    console.log('⏱️ Exit Intent blocked - need 2 minutes on page');
    return false;
  }
  
  console.log('✅ Exit Intent can show');
  return true;
}

/**
 * Get timing constants for external use
 */
export function getUnifiedBumperTimingConstants() {
  return {
    INITIAL_TIMER_MS,
    MOUSE_MOVEMENT_TIMER_MS,
    EXIT_INTENT_TIMER_MS,
    POST_BUMPER_DELAY_MS
  };
}

/**
 * Reset state for development/testing
 */
export function resetUnifiedBumperState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 Unified bumper state reset');
  }
}

/**
 * Check if in development mode
 */
function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' || 
         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
}
