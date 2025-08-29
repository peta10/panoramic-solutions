/**
 * Comprehensive Bumper Debugging Utility
 * Use this to understand why bumpers aren't showing up
 */

import { getUnifiedBumperState, shouldShowProductBumper, shouldShowExitIntentBumper } from './unifiedBumperState';
import { getHomeState, shouldAllowBumpers, isInHomeState, getOpenOverlays } from './homeState';

export interface BumperDebugInfo {
  timestamp: string;
  productBumper: {
    shouldShow: boolean;
    blockedBy: string[];
    state: any;
  };
  exitIntentBumper: {
    shouldShow: boolean;
    blockedBy: string[];
    state: any;
  };
  homeState: {
    isInHomeState: boolean;
    shouldAllowBumpers: boolean;
    openOverlays: string[];
    state: any;
  };
  timing: {
    toolOpenedAt: string;
    timeOnPage: number;
    timeOnPageFormatted: string;
    initialTimerComplete: boolean;
    mouseMovementTimerComplete: boolean;
    lastMouseMovementAt?: string;
    mouseStoppedAt?: string;
    timeSinceMouseStopped?: number;
  };
  userActions: {
    hasClickedIntoGuidedRankings: boolean;
    hasClickedIntoComparisonReport: boolean;
    guidedRankingsOpenedAt?: string;
    comparisonReportOpenedAt?: string;
    guidedRankingsClosedAt?: string;
    comparisonReportClosedAt?: string;
  };
  bumperHistory: {
    productBumperShown: boolean;
    productBumperDismissed: boolean;
    exitIntentShown: boolean;
    exitIntentDismissed: boolean;
  };
}

/**
 * Get comprehensive debug information about bumper state
 */
export function getBumperDebugInfo(): BumperDebugInfo {
  const unifiedState = getUnifiedBumperState();
  const homeState = getHomeState();
  const now = Date.now();
  const toolOpenedAt = new Date(unifiedState.toolOpenedAt).getTime();
  const timeOnPage = now - toolOpenedAt;
  
  // Check what's blocking Product Bumper
  const productBumperBlocked: string[] = [];
  
  if (!shouldAllowBumpers()) {
    productBumperBlocked.push('Not in home state');
  }
  if (unifiedState.hasClickedIntoGuidedRankings) {
    productBumperBlocked.push('User clicked into Guided Rankings');
  }
  if (unifiedState.isAnyBumperCurrentlyOpen) {
    productBumperBlocked.push('Another bumper is open');
  }
  if (unifiedState.isGuidedRankingsCurrentlyOpen) {
    productBumperBlocked.push('Guided Rankings is open');
  }
  if (unifiedState.isComparisonReportCurrentlyOpen) {
    productBumperBlocked.push('Comparison Report is open');
  }
  if (unifiedState.productBumperDismissed) {
    productBumperBlocked.push('Already dismissed');
  }
  if (unifiedState.productBumperShown) {
    productBumperBlocked.push('Already shown');
  }
  if (!unifiedState.initialTimerComplete) {
    productBumperBlocked.push('Initial 23s timer not complete');
  }
  if (!unifiedState.mouseStoppedAt) {
    productBumperBlocked.push('Mouse has not stopped moving');
  } else {
    const mouseStoppedAt = new Date(unifiedState.mouseStoppedAt).getTime();
    const timeSinceMouseStopped = now - mouseStoppedAt;
    if (timeSinceMouseStopped < 3000) {
      productBumperBlocked.push(`Mouse stopped only ${Math.round(timeSinceMouseStopped/1000)}s ago (need 3s)`);
    }
  }

  // Check what's blocking Exit Intent Bumper
  const exitIntentBlocked: string[] = [];
  
  if (!shouldAllowBumpers()) {
    exitIntentBlocked.push('Not in home state');
  }
  if (unifiedState.hasClickedIntoGuidedRankings) {
    exitIntentBlocked.push('User clicked into Guided Rankings');
  }
  if (unifiedState.isAnyBumperCurrentlyOpen) {
    exitIntentBlocked.push('Another bumper is open');
  }
  if (unifiedState.isGuidedRankingsCurrentlyOpen) {
    exitIntentBlocked.push('Guided Rankings is open');
  }
  if (unifiedState.isComparisonReportCurrentlyOpen) {
    exitIntentBlocked.push('Comparison Report is open');
  }
  if (unifiedState.exitIntentShown) {
    exitIntentBlocked.push('Already shown');
  }
  if (timeOnPage < 120000) {
    exitIntentBlocked.push(`Only ${Math.round(timeOnPage/1000)}s on page (need 120s)`);
  }

  return {
    timestamp: new Date().toISOString(),
    productBumper: {
      shouldShow: shouldShowProductBumper(),
      blockedBy: productBumperBlocked,
      state: unifiedState
    },
    exitIntentBumper: {
      shouldShow: shouldShowExitIntentBumper(),
      blockedBy: exitIntentBlocked,
      state: unifiedState
    },
    homeState: {
      isInHomeState: isInHomeState(),
      shouldAllowBumpers: shouldAllowBumpers(),
      openOverlays: getOpenOverlays(),
      state: homeState
    },
    timing: {
      toolOpenedAt: unifiedState.toolOpenedAt,
      timeOnPage,
      timeOnPageFormatted: `${Math.round(timeOnPage/1000)}s`,
      initialTimerComplete: unifiedState.initialTimerComplete,
      mouseMovementTimerComplete: unifiedState.mouseMovementTimerComplete,
      lastMouseMovementAt: unifiedState.lastMouseMovementAt,
      mouseStoppedAt: unifiedState.mouseStoppedAt,
      timeSinceMouseStopped: unifiedState.mouseStoppedAt 
        ? now - new Date(unifiedState.mouseStoppedAt).getTime() 
        : undefined
    },
    userActions: {
      hasClickedIntoGuidedRankings: unifiedState.hasClickedIntoGuidedRankings,
      hasClickedIntoComparisonReport: unifiedState.hasClickedIntoComparisonReport,
      guidedRankingsOpenedAt: unifiedState.guidedRankingsOpenedAt,
      comparisonReportOpenedAt: unifiedState.comparisonReportOpenedAt,
      guidedRankingsClosedAt: unifiedState.guidedRankingsClosedAt,
      comparisonReportClosedAt: unifiedState.comparisonReportClosedAt
    },
    bumperHistory: {
      productBumperShown: unifiedState.productBumperShown,
      productBumperDismissed: unifiedState.productBumperDismissed,
      exitIntentShown: unifiedState.exitIntentShown,
      exitIntentDismissed: unifiedState.exitIntentDismissed
    }
  };
}

/**
 * Print a comprehensive debug report to console
 */
export function printBumperDebugReport(): void {
  const debug = getBumperDebugInfo();
  
  console.group('🔍 BUMPER DEBUG REPORT');
  console.log('Timestamp:', debug.timestamp);
  
  console.group('⏱️ TIMING');
  console.log('Time on page:', debug.timing.timeOnPageFormatted);
  console.log('Initial timer complete:', debug.timing.initialTimerComplete);
  console.log('Mouse movement timer complete:', debug.timing.mouseMovementTimerComplete);
  console.log('Last mouse movement:', debug.timing.lastMouseMovementAt);
  console.log('Mouse stopped at:', debug.timing.mouseStoppedAt);
  if (debug.timing.timeSinceMouseStopped) {
    console.log('Time since mouse stopped:', `${Math.round(debug.timing.timeSinceMouseStopped/1000)}s`);
  }
  console.groupEnd();
  
  console.group('🏠 HOME STATE');
  console.log('Is in home state:', debug.homeState.isInHomeState);
  console.log('Should allow bumpers:', debug.homeState.shouldAllowBumpers);
  console.log('Open overlays:', debug.homeState.openOverlays);
  console.groupEnd();
  
  console.group('👤 USER ACTIONS');
  console.log('Clicked into Guided Rankings:', debug.userActions.hasClickedIntoGuidedRankings);
  console.log('Clicked into Comparison Report:', debug.userActions.hasClickedIntoComparisonReport);
  console.log('Guided Rankings opened at:', debug.userActions.guidedRankingsOpenedAt);
  console.log('Guided Rankings closed at:', debug.userActions.guidedRankingsClosedAt);
  console.log('Comparison Report opened at:', debug.userActions.comparisonReportOpenedAt);
  console.log('Comparison Report closed at:', debug.userActions.comparisonReportClosedAt);
  console.groupEnd();
  
  console.group('🎯 PRODUCT BUMPER');
  console.log('Should show:', debug.productBumper.shouldShow);
  console.log('Already shown:', debug.bumperHistory.productBumperShown);
  console.log('Already dismissed:', debug.bumperHistory.productBumperDismissed);
  if (debug.productBumper.blockedBy.length > 0) {
    console.log('❌ BLOCKED BY:');
    debug.productBumper.blockedBy.forEach(reason => console.log(`   - ${reason}`));
  } else {
    console.log('✅ No blocking conditions');
  }
  console.groupEnd();
  
  console.group('🚪 EXIT INTENT BUMPER');
  console.log('Should show:', debug.exitIntentBumper.shouldShow);
  console.log('Already shown:', debug.bumperHistory.exitIntentShown);
  console.log('Already dismissed:', debug.bumperHistory.exitIntentDismissed);
  if (debug.exitIntentBumper.blockedBy.length > 0) {
    console.log('❌ BLOCKED BY:');
    debug.exitIntentBumper.blockedBy.forEach(reason => console.log(`   - ${reason}`));
  } else {
    console.log('✅ No blocking conditions');
  }
  console.groupEnd();
  
  console.groupEnd();
}

/**
 * Reset all bumper state for testing
 */
export function resetAllBumperState(): void {
  console.log('🔄 Resetting all bumper state...');
  
  // Clear localStorage
  localStorage.removeItem('unifiedBumperState');
  localStorage.removeItem('ppmToolHomeState');
  localStorage.removeItem('productBumperState');
  localStorage.removeItem('exitIntentState');
  
  console.log('✅ All bumper state cleared');
  console.log('🔄 Please refresh the page to start fresh');
}

/**
 * Force trigger conditions for testing
 */
export function forceTriggerConditions(): void {
  console.log('🔧 Force triggering bumper conditions...');
  
  const unifiedState = getUnifiedBumperState();
  
  // Force timing conditions
  unifiedState.initialTimerComplete = true;
  unifiedState.mouseMovementTimerComplete = true;
  unifiedState.mouseStoppedAt = new Date(Date.now() - 5000).toISOString(); // 5 seconds ago
  
  // Reset blocking conditions
  unifiedState.hasClickedIntoGuidedRankings = false;
  unifiedState.hasClickedIntoComparisonReport = false;
  unifiedState.productBumperShown = false;
  unifiedState.productBumperDismissed = false;
  unifiedState.exitIntentShown = false;
  unifiedState.exitIntentDismissed = false;
  unifiedState.isAnyBumperCurrentlyOpen = false;
  unifiedState.isGuidedRankingsCurrentlyOpen = false;
  unifiedState.isComparisonReportCurrentlyOpen = false;
  
  // Save state
  localStorage.setItem('unifiedBumperState', JSON.stringify(unifiedState));
  
  console.log('✅ Forced trigger conditions set');
  console.log('🔄 Bumpers should now be eligible to show');
}

// Make functions available globally for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).debugBumpers = printBumperDebugReport;
  (window as any).getBumperDebugInfo = getBumperDebugInfo;
  (window as any).resetAllBumperState = resetAllBumperState;
  (window as any).forceTriggerConditions = forceTriggerConditions;
  
  console.log('🔧 Bumper debugging functions available:');
  console.log('   debugBumpers() - Print comprehensive debug report');
  console.log('   getBumperDebugInfo() - Get debug data object');
  console.log('   resetAllBumperState() - Clear all state');
  console.log('   forceTriggerConditions() - Force bumpers to be eligible');
}
